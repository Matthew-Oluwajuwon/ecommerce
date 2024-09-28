import { Request, Response } from "express";
import { Product } from "../../models/Product";
import { User } from "../../models/User";  // Assuming you have a User model

// Get Products by User ID Controller (Merchant Access Only)
export const getProductsByUserId = async (req: Request, res: Response) => {
  const userId = req.query.userId as string; // Get userId from query params

  try {
    // Fetch user details based on userId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "User not found.",
        data: null,
      });
    }

    // Check if the user is a merchant
    if (user.role_type !== "MERCHANT") {
      return res.status(403).json({
        responseCode: 403,
        responseMessage: "Only merchants are allowed to view products.",
        data: null,
      });
    }

    // Fetch products created by the merchant (user)
    const products = await Product.find({ user: user._id });

    // If no products are found for this merchant
    if (products.length === 0) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "No products found for this merchant.",
        data: null,
      });
    }

    // Return the found products
    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Products fetched successfully.",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
