import { Response } from "express";
import { Cart } from "../../models/Cart";

// Get user's cart
export const getCart = async (req: any, res: Response) => {
    const userId = req.user.id; // Assuming user is authenticated and userId is in the token
  
    try {
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
  
      if (!cart) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "Cart not found",
          data: null,
        });
      }
  
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Cart retrieved successfully",
        data: cart,
      });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
  