import { Request, Response } from "express";
import knex from "../database/dbConnect";
import bcrypt from "bcrypt";
import { createUserBody } from "../validation/schemaUser";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = createUserBody.parse(req.body);

    const checkEmailExists = await knex("users").where({ email }).first();

    if (checkEmailExists) {
      return res
        .status(400)
        .json({ message: "The email provided already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await knex("users").insert({
      name,
      email,
      password: encryptedPassword,
      created_at: new Date(),
    });

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" + error });
  }
};
