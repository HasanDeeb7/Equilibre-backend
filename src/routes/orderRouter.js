import { Router } from "express";
import {
    addNewOrder,
    deleteOrder,
    getOneOrder,
    getOrders,
    updateOrder,

} from "../controllers/userController.js";

export const userRoutes = Router();

userRoutes.post("/addNewOrder", addNewOrder);
userRoutes.get("/getOrders", getOrders);
userRoutes.get("/one/:id", getOneOrder);
userRoutes.delete("/delete", deleteOrder);
userRoutes.patch("/update",     updateOrder,
);
