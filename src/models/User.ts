import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      min: 3,
      trim: true,
    },
    lastName: {
      type: String,
      min: 3,
      trim: true,
    },
    email_address: {
      type: String,
      min: 3,
      trim: true,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      min: 10,
      trim: true,
    },
    home_address: {
      type: String,
      min: 3,
      trim: true,
    },
    password: {
      type: String,
      min: 3,
      trim: true,
      required: true
    },
    profile_image: {
      type: String,
      trim: true,
    },
    role_type: {
      type: String,
      enum: ["ADMIN", "MERCHANT", "USER"],
      default: "USER", // Initial role is user
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
