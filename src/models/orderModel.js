import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new mongoose.Schema({
    shippingAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["delivered", "completed", "pending", "cancelled", "confirmed"],
        default: "pending",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
        unique: true,
    },
    deliveryFee: {
        type: Number,
        required: true,
    },
    isFreeDelivery: {
        type: Boolean,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
    }],

});

export default model("Order", orderSchema);
