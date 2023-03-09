import { Response } from "express";
import knex from "../database/dbConnect";
import { MyReq } from "../types";

export const createTransaction = async (req: MyReq, res: Response) => {
  const userId = req.userData?.id;
  const { description, value, type, date, category_id } = req.body;

  if (type != "output" && type != "entry") {
    return res.status(400).json({ message: "Invalid transaction type" });
  }

  try {
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
    return res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};
