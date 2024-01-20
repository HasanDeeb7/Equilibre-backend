import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";
import Size from "../models/SizeModel.js";
import Category from "../models/categoriesModel.js";
import slugify from "slugify";

const AddProduct = async (req, res) => {
    const {
      name,
      description,
      nutritionalInfo,
      isDeleted,
      soldQuantityCounter,
      categoryName,
      sizes,
      offerId
    } = req.body;
  
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
  
    const image = req.file.location;
    const slug = slugify(name, { lower: true, replacement: '-' });
    let categoryId;
  
    try {
      // Check if a product with the same name already exists
      const existingProduct = await Product.findOne({ name });
  
      if (existingProduct) {
        return res.status(400).json({ message: "Product with this name already exists" });
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
        offerId
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
  
      return res.status(200).json({ message: 'Product added successfully', data: newProduct });
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
    const products = await Product.find();
    res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getProduct = async (req, res) => {
  const productId = req.query.productId;
  try {
    const product = await Product.findById(productId).populate('sizes');
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

export {
  AddProduct,
  deleteProduct,
  getProducts,
  getProduct,
  editProduct,
  getProductsByCategory,
};
