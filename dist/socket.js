"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server = (app) => {
    // Create an HTTP server instance to work with both Express and Socket.IO
    return http_1.default.createServer(app);
};
exports.server = server;
const io = (app) => {
    // Initialize Socket.IO with CORS configuration
    return new socket_io_1.Server((0, exports.server)(app), {
        cors: {
            origin: ["http://localhost:5001", "http://localhost:9920"], // Allowed origins for Socket.IO connections
            credentials: true,
        },
    });
};
exports.io = io;
