import { Response } from "express";
import Joi from "joi";
import { Product } from "../../models/Product";
import cloudinary from "../../utils/cloudinaryConfig";

// Update Product Controller
export const updateProduct = async (req: any, res: Response) => {
  const schema = Joi.object({
    productName: Joi.string().min(3).trim().optional(),
    productDescription: Joi.string().min(3).trim().optional(),
    productImage: Joi.string().min(3).trim().optional(),
    productPrice: Joi.number().min(0).optional(),
    productQuantity: Joi.number().min(0).optional(),
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
      .optional(),
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
       if (user.role_type !== "MERCHANT" || !user.isApproved) {
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

    // Update product details
    const updateData = { ...req.body };

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
    await Product.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Product updated successfully",
      data: updateData,
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
