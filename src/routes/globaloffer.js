import { Router } from "express";
import { createOffer, deleteOffer, updateOffer,getOneOffer,getOffers } from "../controllers/globaloffer.js";
import { isAdmin } from "../middlewares/authenticate.js";
import {uploadImage} from '../middlewares/multer.js'

export const globalofferRoutes = Router();

globalofferRoutes.post("/create",uploadImage.single('image'), createOffer);
globalofferRoutes.get("/", getOffers);
globalofferRoutes.get("/one", getOneOffer);
globalofferRoutes.delete("/delete", deleteOffer);
globalofferRoutes.patch("/update",uploadImage.single('image'), updateOffer);