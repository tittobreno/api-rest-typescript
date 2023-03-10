import { Response } from "express";
import { z } from "zod";
import knex from "../database/dbConnect";
import { MyReq } from "../types";
import { bodyNewTransaction } from "../validation/schemaTransactions";

export const createTransaction = async (req: MyReq, res: Response) => {
  const userId = req.userData?.id;

  try {
    const { description, value, type, date, category_id } =
      bodyNewTransaction.parse(req.body);

    if (type != "output" && type != "entry") {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
    const authenticateCategory = await knex("categories")
      .where({
        id: category_id,
      })
      .first();

    if (!authenticateCategory) {
      return res
        .status(400)
        .json({ message: "The category specified not found" });
    }

    const newTransaction = await knex("transactions")
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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(500).json(error.errors);
    }
    return res.status(500).json({ message: "Internal server error: " + error });
  }
};
