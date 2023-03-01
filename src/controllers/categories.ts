import { Response } from "express";
import knex from "../database/dbConnect";

const getCategories = async (res: Response) => {
  try {
    const listCategories = await knex("categories");

    return res.status(200).json(listCategories);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getCategories;
