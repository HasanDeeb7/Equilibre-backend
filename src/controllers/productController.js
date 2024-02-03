import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";
import Size from "../models/SizeModel.js";
import Category from "../models/categoriesModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

const AddProduct = async (req, res) => {
  const {
    name,
    description,
    nutritionalInfo,
    isDeleted,
    categoryName,
    offerId,
    sizes
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const image = req.file.location;
  const slug = slugify(name, { lower: true, replacement: "-" });
  let categoryId;

  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name, isDeleted: false });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    // Check if a product with the same name already deleted (soft delete)
    const existingProductDeleted = await Product.findOne({
      name,
      isDeleted: true,
    });

     if (existingProductDeleted) {
       
     }
    // Create a new product
    const newProduct = await Product.create({
      name,
      description,
      nutritionalInfo,
      image,
      slug,
      isDeleted,
      sizes,
      categoryId,
    });

          // Add the new product's ID to the 'products' array in the associated category
          await Category.findOneAndUpdate(
            { name: categoryName },
            { $push: { products: newProduct._id } }
          );
          await Product.findOneAndUpdate({_id: newProduct._id}, {categoryId: categoryId})
        } else {
          return res.status(404).json({ message: "Category not found" });
        }
      } catch (categoryError) {
        console.error(categoryError);
        return res.status(500).json({
          message: "Error adding product",
          error: categoryError,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding product", error });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.query.productId;
  try {
    const product = await Product.findById(productId);

    if (product) {
      if (product.offerId) {
        await Offer.findByIdAndUpdate(product.offerId, {
          $pull: { products: productId },
        });
      }

      const sizeIdsToDelete = product.sizes.map((size) => size._id);

      await Size.deleteMany({ _id: { $in: sizeIdsToDelete } });

      await Product.findByIdAndDelete(productId);

      res
        .status(200)
        .json({ message: "Product and associated sizes deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).populate([
      "sizes",
      "offerId",
      "categoryId",
    ]);
    res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getProduct = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug }).populate([
      "sizes",
      "offerId",
    ]);
    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editProduct = async (req, res) => {
  const {
    _id,
    name,
    description,
    nutritionalInfo,
    isDeleted,
    soldQuantityCounter,
    categoryName,
  } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  const image = req.file.location;
  let slug;
  if (name) {
    slug = slugify(name, { lower: true, replacement: "-" });
  }
  let categoryId;

  if (categoryName) {
    try {
      const category = await Category.findOne({ name: categoryName });
      categoryId = category._id;
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  try {
    await Product.findOneAndUpdate({_id : _id}, {
      name: name,
      description: description,
      nutritionalInfo: nutritionalInfo,
      image : image,
      slug: slug,
      isDeleted: isDeleted,
      soldQuantityCounter: soldQuantityCounter,
      categoryId: categoryId,
    });
    const updatedproduct = await Product.findById(_id);
    res
      .status(200)
      .json({ message: "product Info edited succ", data: updatedproduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

async function getProductsByCategory(req, res) {
  const { categoryId } = req.query;
  if (!categoryId) {
    return res.status(400).json({ message: "No category id provided" });
  }
  try {
    const products = await Product.find({
      categoryId: categoryId,
      isDeleted: false,
    }).populate("categoryId");
    if (products) {
      return res.json(products);
    }
    return res
      .status(404)
      .json({ message: "No products with from this category" });
  } catch (error) {
    console.log(error);
  }
}

async function searchByProductName(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "No name provided" });
  }
  try {
    const products = await Product.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
      isDeleted: false,
    }).populate(["sizes", "offerId"]);
    if (products) {
      return res.json(products);
    }
    return res.status(404).json([]);
  } catch (error) {
    console.log(error);
  }
}

async function filterProducts(req, res) {
  const { categories, prices } = req.body;

  const filterCriteria = {};
  // If categories are provided, map them to ObjectId and add to filterCriteria.
  if (categories && categories.length > 0) {
    filterCriteria.categoryId = {
      $in: categories.map(
        (categoryId) => new mongoose.Types.ObjectId(categoryId)
      ),
    };
  }

  let priceFilter = [];
  if (prices && prices.length > 0) {
    priceFilter = prices.map((range) => ({
      "sizes.price": { $gte: range.minPrice, $lte: range.maxPrice },
    }));
  }
  try {
    const pipeline = [
      {
        $lookup: {
          from: "sizes",
          localField: "sizes",
          foreignField: "_id",
          as: "sizes",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $match: {
          isDeleted: { $ne: true }, //filter out deleted products
        },
      },
    ];
    // If price filter conditions exist, add a match stage for prices using $or.
    if (filterCriteria.categoryId) {
      pipeline.push({
        $match: {
          "categoryInfo._id": filterCriteria.categoryId,
        },
      });
    }

    if (priceFilter.length > 0) {
      pipeline.push({
        $match: {
          $or: priceFilter,
        },
      });
    }

    const result = await Product.aggregate(pipeline);
    await Product.populate(result, { path: "offerId", model: "Offer" });

    if (result.length === 0) {
      return res.status(200).json([]);
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  AddProduct,
  deleteProduct,
  getProducts,
  getProduct,
  editProduct,
  getProductsByCategory,
  searchByProductName,
  filterProducts,
};
