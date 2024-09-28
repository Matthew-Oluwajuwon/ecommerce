"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgotPassword = exports.updateUser = exports.getUserInfo = exports.login = exports.register = void 0;
const changePassword_1 = require("./changePassword");
Object.defineProperty(exports, "changePassword", { enumerable: true, get: function () { return changePassword_1.changePassword; } });
const forgotPassword_1 = require("./forgotPassword");
Object.defineProperty(exports, "forgotPassword", { enumerable: true, get: function () { return forgotPassword_1.forgotPassword; } });
const updateUser_1 = require("./updateUser");
Object.defineProperty(exports, "updateUser", { enumerable: true, get: function () { return updateUser_1.updateUser; } });
const getUserInfo_1 = require("./getUserInfo");
Object.defineProperty(exports, "getUserInfo", { enumerable: true, get: function () { return getUserInfo_1.getUserInfo; } });
const login_1 = require("./login");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return login_1.login; } });
const register_1 = __importDefault(require("./register"));
exports.register = register_1.default;
