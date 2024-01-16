import mongoose, { Schema, model } from "mongoose";

const offerSchema = new Schema({
discountRate:{
    type:Number,
    required:true
},
startDate:{
    type:Date,
    required:true
},
endDate:{
    type:Date,
    required:true
},
products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],


},
{
    timestamps: true
  }
)

export default model('Offer', offerSchema)
