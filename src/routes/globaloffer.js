import { Router } from "express";
import { createOffer, deleteOffer, updateOffer,getOneOffer,getOffers } from "../controllers/globaloffer.js";


export const globalofferRoutes = Router();

globalofferRoutes.post("/create", createOffer);
globalofferRoutes.get("/", getOffers);
globalofferRoutes.get("/one", getOneOffer);
globalofferRoutes.delete("/delete", deleteOffer);
globalofferRoutes.patch("/update", updateOffer);