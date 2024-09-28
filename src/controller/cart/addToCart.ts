import { Response } from "express";
import { Cart } from "../../models/Cart";
import { Product } from "../../models/Product"; // Assuming you already have a Product model


// Add product to the cart with quantity check
export const addToCart = async (req: any, res: Response) => {
    try {
        const { productId, quantity } = req.body;
    
        // Validate input
        if (!productId || !quantity) {
          return res.status(400).json({
            responseCode: 400,
            responseMessage: "Product ID and quantity are required.",
          });
        }
    
        // Fetch the product from the database to check available stock
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: "Product not found.",
          });
        }
    
        // Check if the requested quantity is available
        if (product.productQuantity < quantity) {
          return res.status(400).json({
            responseCode: 400,
            responseMessage: `Only ${product.productQuantity} units available, but you requested ${quantity}.`,
          });
        }
    
        // Retrieve the user ID from the authenticated user (assuming JWT middleware sets req.user)
        const userId = req.user.id; // Make sure `req.user` contains the authenticated user's ID
    
        let cart = await Cart.findOne({ user: userId });
    
        if (!cart) {
          // Create a new cart if none exists for the user
          cart = new Cart({ user: userId, items: [] });
        }
    
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    
        if (itemIndex > -1) {
          // If the product already exists in the cart, update the quantity
          cart.items[itemIndex].quantity += quantity;
        } else {
          // If the product doesn't exist, add it to the cart
          cart.items.push({ product: productId, quantity });
        }
    
        // Save the cart
        await cart.save();
    
        res.status(200).json({
          responseCode: 200,
          responseMessage: "Product added to cart successfully.",
          data: cart,
        });
      } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({
          responseCode: 500,
          responseMessage: "An error occurred while adding the product to the cart.",
        });
      }
};

