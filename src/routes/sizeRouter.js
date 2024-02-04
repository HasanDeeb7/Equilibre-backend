import { Router } from "express";
import {
 addSize,
 deleteSize,
 getSizes,
 getSize,
 editSize
} from "../controllers/sizeController.js";

export const sizeRoutes = Router();

sizeRoutes.post("/addSize", addSize);
sizeRoutes.delete("/deleteSize", deleteSize);
sizeRoutes.get("/AllSizes",   getSizes);
sizeRoutes.get("/sizebyId",   getSize);
sizeRoutes.patch("/editSize", editSize);

