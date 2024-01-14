import { Router } from "express";
import {
 addOffer
} from "../controllers/offerController.js";

export const offerRoutes = Router();

offerRoutes.post("/addOffer", addOffer);

