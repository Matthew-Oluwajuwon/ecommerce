import { Response } from "express";
import { Product } from "../../models/Product";

// Delete Product Controller
export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Find product by ID and delete
    const product = await Product.findByIdAndDelete(id);

     // Check if the user role_type and isApproved (if MERCHANT)
     const user = req.user as any; // Assuming the `user` is attached to the request after JWT authentication

     // Check if the user is an admin
     if (user.role_type !== "ADMIN") {
       // If the user is not an admin, check if they are a merchant and approved
       if (user.role_type !== "MERCHANT" || !user.is_approved) {
         return res.status(403).json({
           responseCode: 403,
           responseMessage: "Only approved merchants or admin users can delete products.",
           data: null,
         });
       }
     }

    if (!product) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Product deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
