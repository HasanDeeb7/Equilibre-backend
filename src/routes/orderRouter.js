import express from "express";
const orderRouter = express.Router();
import {
    addOrder,
    getAllOrders
} from "../controllers/orderController.js";


orderRouter.post("/addNewOrder", addOrder);
orderRouter.get("/getallorders", getAllOrders);
// userRoutes.get("/one/:id", getOneOrder);
// userRoutes.delete("/delete", deleteOrder);
// userRoutes.patch("/update", updateOrder);

export default orderRouter