import express from "express";
const orderRouter = express.Router();
import {
    addOrder,
    getAllOrders,
    getOneOrderById,
    deleteOrder,
    updateOrder
} from "../controllers/orderController.js";


orderRouter.post("/addNewOrder", addOrder);
orderRouter.get("/getallorders", getAllOrders);
orderRouter.get("/one/:id", getOneOrderById);
orderRouter.delete("/delete", deleteOrder);
orderRouter.patch("/update", updateOrder);

export default orderRouter