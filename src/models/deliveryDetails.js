import mongoose, { Schema, model } from "mongoose";

const deliveryDetails = new Schema({
inLebanonDeliveryFee:{
    type:Number,
},
FreeDeliveryAmount:{
    type:Number,
    required:true
},
},
{
    timestamps: true
  }
)

export default model('DeliveryDetails', deliveryDetails)
