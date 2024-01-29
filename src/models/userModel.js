import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  passwordUpdatedAt: {
    type: Date,
    default: Date.now(),
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  age: {
    type: Number,
    min: 18,
    max: 78,
  },
});

export default model("User", userSchema);
