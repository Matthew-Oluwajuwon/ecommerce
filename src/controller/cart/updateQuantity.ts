import { Response } from "express";
import { Cart } from "../../models/Cart";

// Update quantity of a product in the cart
export const updateCartItemQuantity = async (req: any, res: Response) => {
  const userId = req.user.id; // Assuming user is authenticated
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Cart not found",
        data: null,
      });
    }

    // Check if the product exists in the cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Product not found in cart",
        data: null,
      });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
