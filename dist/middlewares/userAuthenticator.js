"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const schemaUser_1 = require("../validation/schemaUser");
const authenticateUser = (req, res, next) => {
    try {
        const { authorization } = schemaUser_1.authorizationHeaderSchema.parse(req.headers);
        const token = authorization.split(" ")[1];
        const user = jsonwebtoken_1.default.verify(token, process.env.PASSWORD_JWT);
        req.userData = user;
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(401).json({ message: error });
        }
        return res.status(401).json({ message: "Invalid Token" });
    }
};
exports.default = authenticateUser;
