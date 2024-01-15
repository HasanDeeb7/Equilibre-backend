import { Router } from "express";
import { createOffer, deleteOffer, updateOffer,getOneOffer,getOffers } from "../controllers/globaloffer.js";
import { isAdmin } from "../middlewares/authenticate.js";
import {uploadImage} from '../middlewares/multer.js'

export const offerRoutes = Router();

offerRoutes.post("/create",uploadImage.single('image'), createOffer);
offerRoutes.get("/", getOffers);
offerRoutes.get("/one", getOneOffer);
offerRoutes.delete("/delete", deleteOffer);
offerRoutes.patch("/update",uploadImage('image'), updateOffer);