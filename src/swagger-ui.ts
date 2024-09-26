import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

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
        url: "http://localhost:8001", // Local development server
        description: "Local server",
      },
      {
        url: "https://ecommerce-production-409b.up.railway.app", // Production server URL
        description: "Production server",
      },
    ],
  };
  
  // Swagger options, specifying the path to the routes where API documentation is defined
  const options = {
    swaggerDefinition,
    apis: [path.resolve(__dirname, process.env.DEV === 'true' ? "./routes/*.ts" : "./routes/*.js")], // Use TypeScript in development, JavaScript in production
  };
  
  // Initialize swagger-jsdoc which returns validated Swagger spec in JSON format
 export const swaggerSpec = swaggerJSDoc(options);