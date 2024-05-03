"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPasswordBody = exports.editUserAvatar = exports.editUserBody = exports.authorizationHeaderSchema = exports.signInBody = exports.createUserBody = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserBody = zod_1.default.object({
    name: zod_1.default.string({ required_error: "The name is required" }),
    email: zod_1.default.string({ required_error: "The email is required" }).email(),
    password: zod_1.default
        .string({ required_error: "The password is required" })
        .min(6, { message: "The password must be 6 or more characters" }),
});
exports.signInBody = zod_1.default.object({
    email: zod_1.default.string({ required_error: "The email is required" }).email(),
    currentPassword: zod_1.default.string({ required_error: "The password is required" }),
});
exports.authorizationHeaderSchema = zod_1.default.object({
    authorization: zod_1.default.string().refine((value) => value.startsWith("Bearer "), {
        message: "Invalid token",
    }),
});
exports.editUserBody = zod_1.default.object({
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().email().optional(),
});
exports.editUserAvatar = zod_1.default.object({
    avatar: zod_1.default.string().optional(),
});
exports.editPasswordBody = zod_1.default.object({
    newPassword: zod_1.default.optional(zod_1.default.string().min(6, { message: "The password must be 6 or more characters" })),
    currentPassword: zod_1.default.optional(zod_1.default.string()),
});
