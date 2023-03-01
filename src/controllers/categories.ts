import { Response } from "express";
import knex from "../database/dbConnect";
import { MyReq } from "../types";

const getCategories = async (req: MyReq, res: Response) => {
  try {
    const listCategories = await knex("categories");

    return res.status(200).json(listCategories);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error:" + error.message });
  }
};

export default getCategories;
