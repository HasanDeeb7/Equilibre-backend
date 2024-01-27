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
    soldQuantityCounter,
    categoryName,
    sizes,
    offerId,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const image = req.file.location;
  const slug = slugify(name, { lower: true, replacement: "-" });
  let categoryId;

  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    // Create a new product
    const newProduct = await Product.create({
      name,
      description,
      nutritionalInfo,
      image,
      slug,
      isDeleted,
      soldQuantityCounter,
      categoryId,
      sizes,
      offerId,
    });

    if (categoryName) {
      try {
        const category = await Category.findOne({ name: categoryName });

        if (category) {
          categoryId = category._id;

          await Category.findOneAndUpdate(
            { name: categoryName },
            { $push: { products: newProduct._id } }
          );
        } else {
          return res.status(404).json({ message: "Category not found" });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    }

    return res
      .status(200)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);

    if (product) {
      //remove the id of product from the offer docs
      if (product.offerId) {
        await Offer.findByIdAndUpdate(product.offerId, {
          $pull: { products: productId },
        });
      }

      await Product.findByIdAndUpdate(productId, { isDeleted: true });

      return res
        .status(200)
        .json({ message: `"${product.name}" product had been deleted succ` });
    } else {
      return res
        .status(404)
        .json({ message: `no such a product with this id` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(["sizes", "offerId"]);
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
    productId,
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
    await Product.findByIdAndUpdate(productId, {
      name,
      description,
      nutritionalInfo,
      image,
      slug,
      isDeleted,
      soldQuantityCounter,
      categoryId,
    });
    const updatedproduct = await Product.findById(productId);
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
    const products = await Product.find({ categoryId: categoryId }).populate(
      "categoryId"
    );
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
    }).populate(["sizes", "offerId"]);
    if (products) {
      return res.json(products);
    }
    return res
      .status(404)
      .json([]);
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
    await Product.populate(result, { path: 'offerId', model: 'Offer' });
  
    if (result.length === 0) {
      return res.status(200).json( [] );
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
