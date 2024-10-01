import { Response } from "express";
import Joi from "joi";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category"; // Import the Category model
import cloudinary from "../../utils/cloudinaryConfig";
import { User } from "../../models/User";  // Assuming you have a User model for checking role_type and isApproved
import { SubCategory } from "../../models/SubCategory";

// Create Product Controller
export const createProduct = async (req: any, res: Response) => {
  // Updated Joi schema to validate categoryId instead of enum strings
  const schema = Joi.object({
    productName: Joi.string().min(3).trim().required(),
    productDescription: Joi.string().min(3).trim().required(),
    productImage: Joi.string().min(3).trim().required(),
    productPrice: Joi.number().min(0).required(),
    productQuantity: Joi.number().min(0).required(),
    productCategoryId: Joi.string().required(),
    productSubCategoryId: Joi.string().required(),
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
      if (user.role_type !== "MERCHANT" || !user.is_approved) {
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

    // Fetch the category using the provided productCategoryId
    const category = await Category.findById(req.body.productCategoryId);
    if (!category) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Invalid category ID.",
        data: null,
      });
    }

     // Fetch the subcategory using the provided productSubCategoryId
     const subCategory = await SubCategory.findById(req.body.productSubCategoryId);
     if (!subCategory) {
       return res.status(400).json({
         responseCode: 400,
         responseMessage: "Invalid subcategory ID.",
         data: null,
       });
     }
 
     // Check if the category exists in the subcategory
     if (subCategory.category.toString() !== req.body.productCategoryId) {
       return res.status(400).json({
         responseCode: 400,
         responseMessage: "The provided category does not match the subcategory.",
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
      productCategory: category._id,  // Set productCategory to the category's ObjectId
      user: user.id,
    });

    await product.save();

    // Populate the user and productCategory fields
    const populatedProduct = await Product.findById(product._id)
      .populate('user', '-password')  // Exclude sensitive fields like password
      .populate('productCategory');   // Populate the productCategory field

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
