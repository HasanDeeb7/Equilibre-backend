import { Router } from "express";
import {
 addOffer,
 deleteOffer,
 getOffer,
 getOffers,
 editOffer
} from "../controllers/offerController.js";

export const offerRoutes = Router();

offerRoutes.post("/addOffer", addOffer);
offerRoutes.delete("/deleteOffer", deleteOffer);
offerRoutes.get("/AllOffers",   getOffers);
offerRoutes.get("/OfferbyId",   getOffer);
offerRoutes.patch("/editOffer",   editOffer);



