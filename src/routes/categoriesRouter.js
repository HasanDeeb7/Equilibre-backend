import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoriesController.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
// categoryRoutes.get("/one", getOneCategory);
categoryRoutes.post("/create", authenticate, isAdmin, createCategory);
categoryRoutes.patch("/update", authenticate, isAdmin, updateCategory);
categoryRoutes.delete("/delete", authenticate, isAdmin, deleteCategory);
export default categoryRoutes;
