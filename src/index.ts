import { dbConnection } from "./db";
import express, { Request, Response } from "express";
import { port } from "./utils/envConfig";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { swaggerSpec } from "./swagger-ui";
import { io, server } from "./socket";
import { userRouter } from "./routes";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Serve the Swagger docs through an endpoint
app.use("/swagger/index.html", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enable Cross-Origin Resource Sharing (CORS) for all requests
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Basic route for the root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to ecommerce RESTful APIs"); // Response for the base URL
});

// Difference routes in the application
app.use("/api/v1/authhentication/", userRouter)

// Handle Socket.IO connection events
io(app).on("connection", (socket) => {
  console.log("A user connected:", socket.id); // Log user connections by socket ID
});

// Establish database connection
dbConnection();

// Start server with Socket.IO, listening on the specified port
server(app).listen(port, () => {
  console.log(`Server is running on port ${port}`); // Confirmation message once the server is running
});
