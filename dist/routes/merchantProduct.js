"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchantProduct_1 = require("../controller/merchantProduct");
const authenticateJWT_1 = __importDefault(require("../middleware/authenticateJWT"));
const merchantProductRoutes = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Merchant Product Controller
 *     description: Merchant Product management routes
 */
/**
 * @swagger
 * /api/v1/merchant-product:
 *   get:
 *     summary: Get products by user ID
 *     tags: [Merchant Product Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     description: Fetch products created by a merchant using their user ID passed as a query parameter.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user (merchant) whose products are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products fetched successfully.
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
 *                   example: "Products fetched successfully."
 *
 */
// Route to get products by user ID
merchantProductRoutes.get("/", authenticateJWT_1.default, merchantProduct_1.getProductsByUserId);
exports.default = merchantProductRoutes;
