import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    nutritionalInfo: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    soldQuantityCounter: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
    }

})

export default model('Product', productSchema)