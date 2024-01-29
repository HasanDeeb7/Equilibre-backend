import mongoose from "mongoose";

const { Schema, model } = mongoose;

const consultationSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: [String], required: true },
});

const Consultation = model("Consultation", consultationSchema);

export default Consultation;
