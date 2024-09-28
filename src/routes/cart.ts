// Express Router for Cart
import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItemQuantity } from "../controller/cart";
import authenticateJWT from "../middleware/authenticateJWT";

const cartRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart Controller
 *     description: Cart management routes
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Add a product to the user's cart by specifying the product ID and quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add to the cart
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 200
 *                 responseMessage:
 *                   type: string
 *                   example: "Product added to cart successfully."
 *       400:
 *         description: Invalid input or product already exists in the cart
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
cartRoutes.post("/add", authenticateJWT, addToCart);

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Fetch all items currently in the user's cart.
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 200
 *                 responseMessage:
 *                   type: string
 *                   example: "Cart fetched successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
cartRoutes.get("/", authenticateJWT, getCart);

/**
 * @swagger
 * /api/v1/cart/remove:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Remove a specific product from the user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 200
 *                 responseMessage:
 *                   type: string
 *                   example: "Product removed from cart successfully."
 *       400:
 *         description: Product not found in cart
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

cartRoutes.delete("/remove", authenticateJWT, removeFromCart);

/**
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     summary: Update product quantity in the cart
 *     tags: [Cart Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Update the quantity of a specific product in the user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to update
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the product
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 200
 *                 responseMessage:
 *                   type: string
 *                   example: "Product quantity updated successfully."
 *       400:
 *         description: Invalid input or product not found in cart
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
cartRoutes.put("/update", authenticateJWT, updateCartItemQuantity);

export default cartRoutes;
