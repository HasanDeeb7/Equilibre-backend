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
    image: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
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
    sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Size" }],
    offers:[{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }]

},
{
    timestamps: true
  })

export default model('Product', productSchema)