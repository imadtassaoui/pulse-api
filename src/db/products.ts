import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  category: {
    type: String,
    enum: ["T-SHIRT", "HOODIES", "PANTS", "SHORTS", "HATS"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["M", "F", "UNISEX"],
    required: true,
  },
  sizes: {
    XXL: {
      type: Number,
      default: 0,
    },
    XL: {
      type: Number,
      default: 0,
    },
    L: {
      type: Number,
      default: 0,
    },
    M: {
      type: Number,
      default: 0,
    },
    S: {
      type: Number,
      default: 0,
    },
    XS: {
      type: Number,
      default: 0,
    },
  },
  images: {
    type: [String],
  },
  details: {
    type: String,
    required: true,
  },
  fabricAndFit: {
    type: String,
    required: true,
  },
});

ProductSchema.index(
  {
    name: "text",
    category: "text",
    gender: "text",
    details: "text",
    fabricAndFit: "text",
  },
  {
    weights: {
      name: 5,
      category: 4,
      gender: 3,
      details: 2,
      fabricAndFit: 1,
    },
    name: "TextIndex",
  }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
