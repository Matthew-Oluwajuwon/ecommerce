"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Define Swagger documentation properties
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Ecommerce Application",
        version: "1.0.0",
        description: "A simple ecommerce application", // Brief description of your application
    },
    servers: [
        {
            url: "http://localhost:3000", // Local development server
            description: "Local server",
        },
        {
            url: "https://ticketing-production.up.railway.app", // Production server URL
            description: "Production server",
        },
    ],
};
// Swagger options, specifying the path to the routes where API documentation is defined
const options = {
    swaggerDefinition,
    apis: [path_1.default.resolve(__dirname, process.env.DEV === 'true' ? "./routes/*.ts" : "./routes/*.js")], // Use TypeScript in development, JavaScript in production
};
// Initialize swagger-jsdoc which returns validated Swagger spec in JSON format
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
