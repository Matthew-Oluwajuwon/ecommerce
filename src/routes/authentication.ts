import express, { Router } from "express";
import { getUserInfo, login, register } from "../controller/authentication";
import authenticateJWT from "../middleware/authenticateJWT";

const authenticationRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Manages all authentication related routes
 */

/**
 * @swagger
 * /api/v1/authentication/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_address:
 *                 type: string
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123@"
 *               role_type:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MERCHANT
 *                   - USER
 *                 example: "USER | ADMIN | MERCHANT"  # Example of one enum value
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: "User created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "example@gmail.com"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-25T12:12:00"
 *       401:
 *         description: Unauthorized
 */

authenticationRoutes.post("/register", register);

/**
 * @swagger
 * /api/v1/authentication/login:
 *   post:
 *     summary: Login registered users
 *     description: Authenticates user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_address:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
authenticationRoutes.post("/login", login);

/**
 * @swagger
 * /api/v1/authentication/get-user-info:
 *   get:
 *     summary: Retrieve user information
 *     description: Returns the information of a user. Requires authentication.
 *     tags: [Authentication]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authenticationRoutes.get("/get-user-info", authenticateJWT, getUserInfo);

export default authenticationRoutes;
