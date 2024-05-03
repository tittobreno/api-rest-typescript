"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = exports.deleteTransaction = exports.updateTransaction = exports.detailTransaction = exports.createTransaction = exports.listTransactions = void 0;
const zod_1 = require("zod");
const dbConnect_1 = __importDefault(require("../database/dbConnect"));
const schemaTransactions_1 = require("../validation/schemaTransactions");
const paginationParamsSchema = zod_1.z.object({
    skip: zod_1.z.number(),
    take: zod_1.z.number(),
});
const listTransactions = async (req, res) => {
    const userId = req.userData?.id;
    const skip = parseInt(req.query.skip, 10);
    const take = parseInt(req.query.take, 10);
    let categoryIds = [];
    if (typeof req.query.categories === "string") {
        categoryIds = req.query.categories
            .split(",")
            .map((categoryId) => parseInt(categoryId, 10));
    }
    else if (Array.isArray(req.query.categories)) {
        categoryIds = req.query.categories.map((categoryId) => parseInt(categoryId, 10));
    }
    const { skip: validatedSkip, take: validatedTake } = paginationParamsSchema.parse({ skip, take });
    try {
        let transactionsQuery = (0, dbConnect_1.default)("transactions").where({
            user_id: userId,
        });
        if (categoryIds.length > 0) {
            transactionsQuery = transactionsQuery.whereIn("category_id", categoryIds);
        }
        const totalTransactionsCount = await transactionsQuery
            .clone()
            .count("id as count")
            .first();
        const totalCount = totalTransactionsCount?.count
            ? Number(totalTransactionsCount.count)
            : 0;
        const userTransactions = await transactionsQuery
            .clone()
            .offset(validatedSkip)
            .limit(validatedTake);
        const listUserTransactions = await Promise.all(userTransactions.map(async (transaction) => {
            const category = await (0, dbConnect_1.default)("categories")
                .where({ id: transaction.category_id })
                .first();
            const transactionWithCategoryName = {
                ...transaction,
                category_name: category?.title || "Uncategorized", // Definindo um nome padrão caso a categoria não seja encontrada
            };
            return transactionWithCategoryName;
        }));
        return res.status(200).json({ total: totalCount, listUserTransactions });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to list transactions: " + error.message });
    }
};
exports.listTransactions = listTransactions;
const createTransaction = async (req, res) => {
    const userId = req.userData?.id;
    try {
        const { description, value, type, date, category_id } = schemaTransactions_1.schemaBodyTransaction.parse(req.body);
        if (type != "output" && type != "entry") {
            return res.status(400).json({ message: "Invalid transaction type" });
        }
        const authenticateCategory = await (0, dbConnect_1.default)("categories")
            .where({
            id: category_id,
        })
            .first();
        if (!authenticateCategory) {
            return res
                .status(400)
                .json({ message: "The category specified not found" });
        }
        const newTransaction = await (0, dbConnect_1.default)("transactions")
            .insert({
            description,
            value,
            type,
            date,
            user_id: userId,
            category_id: authenticateCategory.id,
        })
            .returning("*");
        return res.status(201).json(newTransaction);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(500).json(error.errors);
        }
        return res
            .status(500)
            .json({ message: "Failed to create transaction: " + error.message });
    }
};
exports.createTransaction = createTransaction;
const detailTransaction = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const transaction = await (0, dbConnect_1.default)("transactions")
            .where({ id })
            .first();
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res
            .status(200)
            .json({ ...transaction, value: transaction.value / 100 });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(500).json(error.errors);
        }
        return res
            .status(500)
            .json({ message: "Failed to detail transaction: " + error.message });
    }
};
exports.detailTransaction = detailTransaction;
const updateTransaction = async (req, res) => {
    const userId = req.userData?.id;
    try {
        const id = parseInt(req.params.id);
        const { description, value, type, date, category_id } = schemaTransactions_1.schemaBodyTransaction.parse(req.body);
        const transaction = await (0, dbConnect_1.default)("transactions")
            .where({ id })
            .first();
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await (0, dbConnect_1.default)("transactions")
            .update({ description, value, type, date, category_id, user_id: userId })
            .where({ id });
        return res.status(200).json({ message: "Updated successfully" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json(error.errors);
        }
        return res
            .status(500)
            .json({ message: "Failed to update transaction: " + error.message });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const transaction = await (0, dbConnect_1.default)("transactions").where({ id }).first();
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await (0, dbConnect_1.default)("transactions").delete().where({ id });
        return res.status(204).json();
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to delete transaction: " + error.message });
    }
};
exports.deleteTransaction = deleteTransaction;
const getSummary = async (req, res) => {
    try {
        const id = req.userData?.id;
        const earnings = await (0, dbConnect_1.default)("transactions")
            .sum({ totalEarnings: "value" })
            .where({ user_id: id })
            .andWhere({ type: "entry" })
            .first();
        const expenses = await (0, dbConnect_1.default)("transactions")
            .sum({ totalExpenses: "value" })
            .where({ user_id: id })
            .andWhere({ type: "output" })
            .first();
        const response = {
            earnings: Number(earnings?.totalEarnings) || 0,
            expenses: Number(expenses?.totalExpenses) || 0,
            balance: earnings?.totalEarnings - expenses?.totalExpenses,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to get summary: " + error.message });
    }
};
exports.getSummary = getSummary;
