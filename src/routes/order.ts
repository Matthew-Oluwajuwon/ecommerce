import { Router } from "express";
import authenticateJWT from "../middleware/authenticateJWT";
import {
  createOrder,
  getAllOrders,
  getAllOrdersByUserId,
  getSingleOrderByOrderId,
  getSingleOrderByUserIdAndOrderId,
  verifyPayment,
} from "../controller/order";

const orderRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Order Controller
 *     description: Order management routes
 */

/**
 * @swagger
 * /api/v1/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Create a new order based on the user's cart and provided shipping address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user placing the order.
 *                 example: "60c72b2f9b1d8e001c8d4b32"
 *               shippingAddress:
 *                 type: object
 *                 description: Shipping address for the order.
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "1234 Elm St"
 *                   city:
 *                     type: string
 *                     example: "Springfield"
 *                   postalCode:
 *                     type: string
 *                     example: "62704"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 201
 *                 responseMessage:
 *                   type: string
 *                   example: "Order created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the created order.
 *                       example: "615ae2a6b5d9c6001773d0e4"
 *                     userId:
 *                       type: string
 *                       description: ID of the user who placed the order.
 *                       example: "60c72b2f9b1d8e001c8d4b32"
 *                     items:
 *                       type: array
 *                       description: List of items in the order.
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             description: Product ID of the ordered item.
 *                             example: "60c73b1f9b1d8e001c8d4b67"
 *                           quantity:
 *                             type: integer
 *                             description: Quantity of the product ordered.
 *                             example: 2
 *                           price:
 *                             type: number
 *                             description: Price of the product at the time of the order.
 *                             example: 599.99
 *                     totalAmount:
 *                       type: number
 *                       description: Total amount for the order.
 *                       example: 1199.98
 *                     shippingAddress:
 *                       type: object
 *                       description: Shipping address for the order.
 *                       properties:
 *                         street:
 *                           type: string
 *                         city:
 *                           type: string
 *                         postalCode:
 *                           type: string
 *                         country:
 *                           type: string
 *       400:
 *         description: Invalid input data or empty cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 400
 *                 responseMessage:
 *                   type: string
 *                   example: "Your cart is empty."
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 500
 *                 responseMessage:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 data:
 *                   type: null
 */

// Route to post order
orderRoutes.post("/", authenticateJWT, createOrder);

/**
 * @swagger
 * /api/v1/order/verify-payment/{reference}:
 *   get:
 *     summary: Verify payment status
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Verifies the payment status using the transaction reference returned from Paystack.
 *     parameters:
 *       - name: reference
 *         in: path
 *         required: true
 *         description: The reference ID of the transaction.
 *         schema:
 *           type: string
 *           example: "60c73b1f9b1d8e001c8d4b67"
 *     responses:
 *       200:
 *         description: Payment verified successfully.
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
 *                   example: "Payment verified successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       description: The order details.
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60c72b2f9b1d8e001c8d4b32"
 *                         userId:
 *                           type: string
 *                           example: "60c72b2f9b1d8e001c8d4b32"
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               productId:
 *                                 type: string
 *                                 example: "60c73b1f9b1d8e001c8d4b67"
 *                               quantity:
 *                                 type: integer
 *                                 example: 2
 *                               price:
 *                                 type: number
 *                                 example: 599.99
 *                         totalAmount:
 *                           type: number
 *                           example: 1199.98
 *                         status:
 *                           type: string
 *                           example: "paid"
 *                     paymentData:
 *                       type: object
 *                       description: The payment details returned from Paystack.
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "60c73b1f9b1d8e001c8d4b67"
 *                         status:
 *                           type: string
 *                           example: "success"
 *                         amount:
 *                           type: number
 *                           example: 1199.98
 *       400:
 *         description: Payment verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 400
 *                 responseMessage:
 *                   type: string
 *                   example: "Payment verification failed."
 *                 data:
 *                   type: null
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 404
 *                 responseMessage:
 *                   type: string
 *                   example: "Order not found."
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 500
 *                 responseMessage:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 data:
 *                   type: null
 */
// Verify payment route
orderRoutes.get("/verify-payment/:reference", authenticateJWT, verifyPayment);

/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     summary: Get all orders
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
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
 *                   example: "Orders retrieved successfully."
 *       500:
 *         description: Internal server error.
 */

// Get all orders
orderRoutes.get("/", authenticateJWT, getAllOrders);

/**
 * @swagger
 * /api/v1/order/{orderId}:
 *   get:
 *     summary: Get single order by order ID
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *           example: "60c73b1f9b1d8e001c8d4b67"
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
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
 *                   example: "Order retrieved successfully."
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

// Get single order by order ID
orderRoutes.get("/:orderId", authenticateJWT, getSingleOrderByOrderId);

/**
 * @swagger
 * /api/v1/order/user/get-all-orders:
 *   get:
 *     summary: Get all orders by user ID
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
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
 *                   example: "Orders retrieved successfully."
 *       500:
 *         description: Internal server error.
 */

// Get all orders by user ID
orderRoutes.get("/user/get-all-orders", authenticateJWT, getAllOrdersByUserId);

/**
 * @swagger
 * /api/v1/order/user/get-user-order-by-orderId/{orderId}:
 *   get:
 *     summary: Get single order by user ID and order ID
 *     tags: [Order Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *           example: "60c73b1f9b1d8e001c8d4b67"
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
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
 *                   example: "Order retrieved successfully."
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

// Get single order by user ID and order ID
orderRoutes.get(
  "/user/get-user-order-by-orderId/:orderId",
  authenticateJWT,
  getSingleOrderByUserIdAndOrderId
);

export default orderRoutes;
