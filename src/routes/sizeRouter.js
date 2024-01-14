import { Router } from "express";
import {
 addSize
} from "../controllers/sizeController.js";

export const sizeRoutes = Router();

sizeRoutes.post("/addSize", addSize);

