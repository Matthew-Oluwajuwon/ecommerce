"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = exports.cartRoutes = exports.merchantProductRoutes = exports.productRoutes = exports.authenticationRoutes = void 0;
const authentication_1 = __importDefault(require("./authentication"));
exports.authenticationRoutes = authentication_1.default;
const cart_1 = __importDefault(require("./cart"));
exports.cartRoutes = cart_1.default;
const merchantProduct_1 = __importDefault(require("./merchantProduct"));
exports.merchantProductRoutes = merchantProduct_1.default;
const order_1 = __importDefault(require("./order"));
exports.orderRoutes = order_1.default;
const products_1 = __importDefault(require("./products"));
exports.productRoutes = products_1.default;
