import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  getTestimonials,
} from "../controllers/testimonialsController.js";
import {uploadImage} from '../middlewares/multer.js'
import { isAdmin } from "../middlewares/authenticate.js";

export const testomonialsRoutes = Router();
//isAdmin,
testomonialsRoutes.post("/create",uploadImage.single("image"),createTestimonial);
testomonialsRoutes.get("/", getTestimonials);
testomonialsRoutes.delete("/delete",isAdmin, deleteTestimonial);
testomonialsRoutes.patch("/update",isAdmin,uploadImage.single("image"), updateTestimonial);
