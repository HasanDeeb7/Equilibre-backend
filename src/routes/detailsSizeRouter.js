import { Router } from "express";
import { createDelveryDetails, deleteDeliveryDetails, updateDeliveryDetails,getdeliveryDetails } from "../controllers/deliveryDetailsController.js";
export const detailsDeliveryRoutes = Router();

detailsDeliveryRoutes.post("/create",createDelveryDetails);
detailsDeliveryRoutes.get("/", getdeliveryDetails);
detailsDeliveryRoutes.delete("/delete/:id", deleteDeliveryDetails);
detailsDeliveryRoutes.patch("/update/:id",updateDeliveryDetails);
