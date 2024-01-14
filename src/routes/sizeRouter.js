import { Router } from "express";
import {
 addSize,
 deleteSize,
 getSizes,
 getSize
} from "../controllers/sizeController.js";

export const sizeRoutes = Router();

sizeRoutes.post("/addSize", addSize);
sizeRoutes.delete("/deleteSize", deleteSize);
sizeRoutes.get("/AllSizes",   getSizes);
sizeRoutes.get("/sizebyId",   getSize);
