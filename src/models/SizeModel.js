import mongoose, { Schema, model } from "mongoose";

const sizeSchema = new Schema({
    capacity: {
        type: Number,
        required: true
    },
    unit: {
        type: string,
        enum: ['ml', 'g'],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

})


export default model('Size', sizeSchema)