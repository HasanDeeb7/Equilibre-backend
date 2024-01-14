import { Router } from "express";
import {
 addSize,
 deleteSize
} from "../controllers/sizeController.js";

export const sizeRoutes = Router();

sizeRoutes.post("/addSize", addSize);
sizeRoutes.delete("/deleteSize", deleteSize);


