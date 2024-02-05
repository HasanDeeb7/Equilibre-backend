import { Router } from "express";
import { uploadImage } from "../middlewares/multer.js";
import {
  AddProduct,
  deleteProduct,
  getProducts,
  getProduct,
  editProduct,
  getProductsByCategory,
  searchByProductName,
  filterProducts
} from "../controllers/productController.js";

export const productRoutes = Router();

productRoutes.post("/addProduct", uploadImage.single("image"), AddProduct);
productRoutes.delete("/deleteProduct", deleteProduct);
productRoutes.get("/AllProducts", getProducts);
productRoutes.post("/search", searchByProductName);
productRoutes.post("/filter", filterProducts);
productRoutes.get("/byId/:slug", getProduct);
productRoutes.get("/byCategory", getProductsByCategory);
productRoutes.patch("/editProduct", uploadImage.single("image"), editProduct);
