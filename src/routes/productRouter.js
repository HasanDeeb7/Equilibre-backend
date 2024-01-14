import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {
  AddProduct,
  deleteProduct
} from "../controllers/productController.js";

export const productRoutes = Router();

productRoutes.post("/addProduct",upload.single("image"), AddProduct);
productRoutes.delete("/deleteProduct",   deleteProduct);


