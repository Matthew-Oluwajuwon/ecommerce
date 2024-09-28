"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const envConfig_1 = require("./utils/envConfig");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_1 = require("./swagger-ui");
const socket_1 = require("./socket");
const routes_1 = require("./routes");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
// Increase request body size limit
app.use(express_1.default.json({ limit: '10mb' })); // Set the limit to 10MB
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true })); // For form submissions
// Serve the Swagger docs through an endpoint
app.use("/swagger/index.html", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_ui_1.swaggerSpec));
// Enable Cross-Origin Resource Sharing (CORS) for all requests
app.use((0, cors_1.default)());
// Parse incoming JSON requests
app.use(express_1.default.json());
// Basic route for the root endpoint
app.get("/", (_req, res) => {
    res.send("Welcome to ecommerce RESTful APIs"); // Response for the base URL
});
// Difference routes in the application
app.use("/api/v1/authentication/", routes_1.authenticationRoutes);
app.use("/api/v1/product/", routes_1.productRoutes);
// Handle Socket.IO connection events
(0, socket_1.io)(app).on("connection", (socket) => {
    console.log("A user connected:", socket.id); // Log user connections by socket ID
});
// Establish database connection
(0, db_1.dbConnection)();
// Start server with Socket.IO, listening on the specified port
(0, socket_1.server)(app).listen(envConfig_1.port, () => {
    console.log(`Server is running on port ${envConfig_1.port}`); // Confirmation message once the server is running
});
