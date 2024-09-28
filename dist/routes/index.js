"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = exports.authenticationRoutes = void 0;
const authentication_1 = __importDefault(require("./authentication"));
exports.authenticationRoutes = authentication_1.default;
const products_1 = __importDefault(require("./products"));
exports.productRoutes = products_1.default;
