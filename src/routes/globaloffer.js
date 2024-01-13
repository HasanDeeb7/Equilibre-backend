import { Router } from "express";
import { createOffer, deleteOffer, updateOffer,getOneOffer,getOffers } from "../controllers/globaloffer.js";


export const offerRoutes = Router();

offerRoutes.post("/create", createOffer);
offerRoutes.get("/", getOffers);
offerRoutes.get("/one", getOneOffer);
offerRoutes.delete("/delete", deleteOffer);
offerRoutes.patch("/update", updateOffer);