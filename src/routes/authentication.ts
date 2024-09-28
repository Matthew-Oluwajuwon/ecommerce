import { Router } from "express";
import {
    approveOrDisapproveUser,
  changePassword,
  forgotPassword,
  getUserInfo,
  login,
  register,
  updateUser,
} from "../controller/authentication";
import authenticateJWT from "../middleware/authenticateJWT";

const authenticationRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication Controller
 *     description: Manages all authentication related routes
 */

/**
 * @swagger
 * /api/v1/authentication/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *               home_address:
 *                 type: string
 *                 example: "123 Main St, Springfield"
 *               profile_image:
 *                 type: string
 *                 example: "data:image/jpeg;base64,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"
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
 *                 example: "USER"
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
 *                     email_address:
 *                       type: string
 *                       example: "example@gmail.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phone_number:
 *                       type: string
 *                       example: "1234567890"
 *                     home_address:
 *                       type: string
 *                       example: "123 Main St, Springfield"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     role_type:
 *                       type: string
 *                       example: "USER"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-25T12:12:00"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - Validation error
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
 *                   example: "Validation error"
 *                 data:
 *                   type: string
 *                   example: null
 *       409:
 *         description: Conflict - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   example: 409
 *                 responseMessage:
 *                   type: string
 *                   example: "User with this email already exists"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: string
 *                   example: null
 */

authenticationRoutes.post("/register", register);

/**
 * @swagger
 * /api/v1/authentication/login:
 *   post:
 *     summary: Login registered users
 *     description: Authenticates user and returns a JWT token
 *     tags: [Authentication Controller]
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
 *     tags: [Authentication Controller]
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

/**
 * @swagger
 * /api/v1/authentication/update-user-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *               home_address:
 *                 type: string
 *                 example: "123 Main St, Springfield"
 *               profile_image:
 *                 type: string
 *                 example: "data:image/jpeg;base64,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"
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: "User profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email_address:
 *                       type: string
 *                       example: "example@gmail.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phone_number:
 *                       type: string
 *                       example: "1234567890"
 *                     home_address:
 *                       type: string
 *                       example: "123 Main St, Springfield"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *       400:
 *         description: Bad request - Validation error
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
 *                   example: "Validation error"
 *                 data:
 *                   type: string
 *                   example: null
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: string
 *                   example: null
 */

authenticationRoutes.put("/update-user-profile", authenticateJWT, updateUser);

/**
 * @swagger
 * /api/v1/authentication/forgot-password:
 *   post:
 *     summary: Send a default password to the user's email address
 *     tags: [Authentication Controller]
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
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: New password sent successfully
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
 *                   example: "New password sent to your email address"
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 */

authenticationRoutes.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/authentication/change-password:
 *   post:
 *     summary: Change a user's password
 *     tags: [Authentication Controller]
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
 *                 example: "example@gmail.com"
 *               default_password:
 *                 type: string
 *                 example: "randomGeneratedPassword123"
 *               new_password:
 *                 type: string
 *                 example: "NewPassword123@"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *                 data:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Bad request - Incorrect generated password
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
 *                   example: "Generated password is incorrect"
 *                 data:
 *                   type: string
 *                   example: null
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
 *                 data:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: string
 *                   example: null
 */

authenticationRoutes.post("/change-password", changePassword);

/**
 * @swagger
 * /api/v1/authentication/approve-user:
 *   post:
 *     summary: Approve or disapprove a user
 *     description: Update the user's approval status to either APPROVED or DISAPPROVED.
 *     tags: [Authentication Controller]
 *     schema:
 *        type: string
 *        example: Bearer your_token_here
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "userId"
 *               status:
 *                 type: string
 *                 enum:
 *                   - "APPROVED"
 *                   - "DISAPPROVED"
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: User approved or disapproved successfully.
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
 *                   example: "User has been approved."
 *       400:
 *         description: Bad Request.
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
 *                   example: "User ID and status are required."
 *                 data:
 *                   type: null
 *       404:
 *         description: User not found.
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
 *                   example: "User not found."
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal Server Error.
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
authenticationRoutes.post("/approve-user", authenticateJWT, approveOrDisapproveUser);

export default authenticationRoutes;
