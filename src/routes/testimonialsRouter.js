import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  getTestimonials,
} from "../controllers/testimonialsController.js";
import { uploadImage } from "../middlewares/multer.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

export const testomonialsRoutes = Router();
//isAdmin,
testomonialsRoutes.post(
  "/create",
  uploadImage.single("image"),
  createTestimonial
);
testomonialsRoutes.get("/", getTestimonials);
testomonialsRoutes.delete("/delete", authenticate, isAdmin, deleteTestimonial);
testomonialsRoutes.patch(
  "/update",
  uploadImage.single("image"),
  authenticate,
  isAdmin,
  updateTestimonial
);
