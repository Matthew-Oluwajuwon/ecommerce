import { Response } from "express";
import Joi from "joi";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";  // Import the Category model
import cloudinary from "../../utils/cloudinaryConfig";
import { SubCategory } from "../../models/SubCategory";

// Update Product Controller
export const updateProduct = async (req: any, res: Response) => {
  const schema = Joi.object({
    productName: Joi.string().min(3).trim().optional(),
    productDescription: Joi.string().min(3).trim().optional(),
    productImage: Joi.string().min(3).trim().optional(),
    productPrice: Joi.number().min(0).optional(),
    productQuantity: Joi.number().min(0).optional(),
    productCategoryId: Joi.string().optional(),
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
    const { id } = req.params;

    // Check if the user role_type and isApproved (if MERCHANT)
    const user = req.user as any; // Assuming the `user` is attached to the request after JWT authentication

    // Check if the user is an admin
    if (user.role_type !== "ADMIN") {
      // If the user is not an admin, check if they are a merchant and approved
      if (user.role_type !== "MERCHANT" || !user.is_approved) {
        return res.status(403).json({
          responseCode: 403,
          responseMessage: "Only approved merchants or admin users can update products.",
          data: null,
        });
      }
    }

    // Find product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Product not found",
        data: null,
      });
    }

    const updateData = { ...req.body };

    // Check if productCategoryId is provided and fetch the corresponding category
    if (req.body.productCategoryId) {
      const category = await Category.findById(req.body.productCategoryId);
      if (!category) {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: "Invalid category ID.",
          data: null,
        });
      }
      updateData.productCategory = category._id;  // Set productCategory to the category's ObjectId
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

    // Check if a new image is uploaded, and upload to Cloudinary
    if (req.body.productImage) {
      let uploadResult;
      try {
        uploadResult = await cloudinary.uploader.upload(req.body.productImage);
        updateData.productImage = uploadResult.secure_url;
      } catch (uploadError: any) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          responseCode: 500,
          responseMessage: `Uploading image failed: ${uploadError.message}`,
          data: null,
        });
      }
    }

    // Update the product document
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('productCategory');  // Populate category

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
