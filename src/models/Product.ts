import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      min: 3,
      trim: true,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
      min: 3,
      trim: true,
      required: true,
    },
    productImage: {
      type: String,
      min: 3,
      trim: true,
      required: true,
    },
    productPrice: {
      type: Number,
      min: 0,
      trim: true,
      required: true,
    },
    productQuantity: {
      type: Number,
      min: 0,
      trim: true,
      required: true,
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",  // Reference to the Category model
        required: true,
      },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
