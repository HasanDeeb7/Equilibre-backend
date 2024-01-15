import mongoose from "mongoose";

const { Schema, model } = mongoose;

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("testimonial", testimonialSchema);