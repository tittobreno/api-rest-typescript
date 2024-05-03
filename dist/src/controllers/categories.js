"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnect_1 = __importDefault(require("../database/dbConnect"));
const getCategories = async (req, res) => {
    try {
        let listCategories = [];
        listCategories = await (0, dbConnect_1.default)("categories");
        return res.status(200).json(listCategories);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to list categories: " + error.message });
    }
};
exports.default = getCategories;
