import { Response } from "express";
import { Cart } from "../../models/Cart";

// Remove item from cart
export const removeFromCart = async (req: any, res: Response) => {
  const userId = req.user.id; // Assuming user is authenticated
  const { productId } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart using Mongoose's `pull` method
    cart.items.pull({ product: productId });

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart successfully", data: cart });
  } catch (error) {
    return res.status(500).json({ message: "Error removing product from cart", error });
  }
};
