import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    shippingAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["processing", "on-way", "completed", "cancelled"],
        default: "processing",
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
    city: {
        type: String,
                required: true,

        // enum: [
        //     "Beirut",
        //     "Tripoli",
        //     "Sidon-Saida",
        //     "Sour",
        //     "Byblos-Jbeil",
        //     "Jounieh",
        //     "Baalbek",
        //     "Zahle",
        //     "Nabatieh",
        //     "Anjar",
        //     "Bint-Jbeil",
        //     "Batroun",
        //     "AleyChouf-Beiteddine",
        //     "Hermel"
        // ],
    },
    country: {
        type: String,
        required: true,

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
const order = mongoose.model('Order', orderSchema)


export default order;