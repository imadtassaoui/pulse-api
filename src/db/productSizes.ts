import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema({
  sizes: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export const SizeModel = mongoose.model("Size", SizeSchema);
