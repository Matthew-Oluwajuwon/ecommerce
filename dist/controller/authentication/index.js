"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.login = exports.register = void 0;
const getUserInfo_1 = require("./getUserInfo");
Object.defineProperty(exports, "getUserInfo", { enumerable: true, get: function () { return getUserInfo_1.getUserInfo; } });
const login_1 = require("./login");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return login_1.login; } });
const register_1 = __importDefault(require("./register"));
exports.register = register_1.default;
