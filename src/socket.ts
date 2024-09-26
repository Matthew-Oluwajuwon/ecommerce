import { Express } from "express";
import http from "http";
import { Server } from "socket.io";

export const server = (app: Express) => {
    // Create an HTTP server instance to work with both Express and Socket.IO
   return http.createServer(app);

}

export const io = (app: Express) => {

  // Initialize Socket.IO with CORS configuration
  return new Server(server(app), {
    cors: {
      origin: ["http://localhost:5001", "http://localhost:9920"], // Allowed origins for Socket.IO connections
      credentials: true,
    },
  });
};
