import { Router } from "express";
import {
 addOffer,
 deleteOffer
} from "../controllers/offerController.js";

export const offerRoutes = Router();

offerRoutes.post("/addOffer", addOffer);
offerRoutes.delete("/deleteOffer", deleteOffer);


