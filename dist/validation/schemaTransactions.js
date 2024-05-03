"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaBodyTransaction = void 0;
const zod_1 = __importDefault(require("zod"));
exports.schemaBodyTransaction = zod_1.default.object({
    description: zod_1.default.string({ required_error: "Description is required" }),
    value: zod_1.default.number({ required_error: "Value is required" }),
    type: zod_1.default.string({ required_error: "Type is required" }),
    date: zod_1.default.string({ required_error: "Date is required" }),
    category_id: zod_1.default.number({ required_error: "Category id is required" }),
});
