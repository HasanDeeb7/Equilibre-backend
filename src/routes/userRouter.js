import { Router } from "express";
import {
  addNewUser,
  deleteUser,
  getOneUser,
  getUsers,
  signIn,
  updateUser,
} from "../controllers/userController.js";

export const userRoutes = Router();

userRoutes.post("/signup", addNewUser);
userRoutes.post("/signin", signIn);
userRoutes.get("/", getUsers);
userRoutes.get("/one", getOneUser);
userRoutes.delete("/delete", deleteUser);
userRoutes.patch("/update", updateUser);
