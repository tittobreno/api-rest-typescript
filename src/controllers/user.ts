import { Request, Response } from "express";
import knex from "../database/dbConnect";
import bcrypt from "bcrypt";
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "all fields are mandatory" });
  }

  try {
    const checkEmailExists = await knex("users").where({ email }).first();

    if (checkEmailExists) {
      return res
        .status(400)
        .json({ message: "the email provided already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await knex("users").insert({
      name,
      email,
      password: encryptedPassword,
    });

    return res.status(201).json({ message: "created" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error" + error.message });
  }
};
