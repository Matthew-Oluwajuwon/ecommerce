import { Response } from "express";
import Joi from "joi";
import { Product } from "../../models/Product";
import cloudinary from "../../utils/cloudinaryConfig";
import { User } from "../../models/User";  // Assuming you have a User model for checking role_type and isApproved

// Create Product Controller
export const createProduct = async (req: any, res: Response) => {
  const schema = Joi.object({
    productName: Joi.string().min(3).trim().required(),
    productDescription: Joi.string().min(3).trim().required(),
    productImage: Joi.string().min(3).trim().required(),
    productPrice: Joi.number().min(0).required(),
    productQuantity: Joi.number().min(0).required(),
    productCategory: Joi.string()
      .valid(
        "IPHONE_5_SERIES",
        "IPHONE_6_SERIES",
        "IPHONE_7_SERIES",
        "IPHONE_8_SERIES",
        "IPHONE_X_SERIES",
        "IPHONE_11_SERIES",
        "IPHONE_12_SERIES",
        "IPHONE_13_SERIES",
        "IPHONE_14_SERIES",
        "IPHONE_15_SERIES",
        "IPHONE_16_SERIES"
      )
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: error.details[0].message.replace(/\"/g, ""),
      data: null,
    });
  }

  try {
    // Check if the user role_type and isApproved (if MERCHANT)
    const user = req.user as any; // Assuming the `user` is attached to the request after JWT authentication

    // Check if the user is an admin
    if (user.role_type !== "ADMIN") {
      // If the user is not an admin, check if they are a merchant and approved
      if (user.role_type !== "MERCHANT" || !user.isApproved) {
        return res.status(403).json({
          responseCode: 403,
          responseMessage: "Only approved merchants or admin users can create products.",
          data: null,
        });
      }
    }

    // Check if productName already exists
    const existingProduct = await Product.findOne({ productName: req.body.productName });
    if (existingProduct) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Product name already exists.",
        data: null,
      });
    }

    // Upload the image to Cloudinary
    let uploadResult: any;

    try {
      uploadResult = await cloudinary.uploader.upload(req.body.productImage);
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: `Uploading image failed: ${uploadError.message}`,
        error: uploadError.message,
        data: null,
      });
    }

    const product = new Product({
      ...req.body,
      productImage: uploadResult.secure_url,
      user: user.id,
    });

    await product.save();

    // Populate the user field with user details
    const populatedProduct = await Product.findById(product._id).populate('user', '-password'); // Exclude sensitive fields like password

    return res.status(201).json({
      responseCode: 201,
      responseMessage: "Product created successfully",
      data: populatedProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
