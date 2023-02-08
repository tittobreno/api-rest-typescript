import { Request, Response } from "express";
import knex from "../database/dbConnect";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  //verificar se existe email cadastrado

  await knex("users").insert({
    name,
    email,
    password,
  });

  res.status(201).json({ message: "Created" });
};
