import { Router } from "express";
import { createOffer, deleteOffer, updateOffer,getActiveOffer,getOffers } from "../controllers/globaloffer.js";
import { isAdmin } from "../middlewares/authenticate.js";
import {uploadImage} from '../middlewares/multer.js'

export const globalofferRoutes = Router();

globalofferRoutes.post("/create", createOffer);
globalofferRoutes.get("/", getOffers);
globalofferRoutes.get("/activeOffer", getActiveOffer);
globalofferRoutes.delete("/delete", deleteOffer);
globalofferRoutes.patch("/update",updateOffer);