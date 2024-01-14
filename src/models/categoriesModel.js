import mongoose from "mongoose";

const { Schema, model } = mongoose;
const categoriesModel = Schema({
  name: { type: String, required: true },
  products: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
});

export default model("Category", categoriesModel);
