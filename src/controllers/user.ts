import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import z from "zod";
import knex from "../database/dbConnect";
import { UserModel } from "../models/user";
import { MyReq, TokenPayload } from "../types";
import { createUserBody, signInBody } from "../validation/schemaUser";

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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(500).json({ message: error });
    }

    return res
      .status(500)
      .json({ message: "Failed to create user: " + error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = signInBody.parse(req.body);

    const user: UserModel = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkIfPasswordIsCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkIfPasswordIsCorrect) {
      res.status(401).json({ message: "Email and/or password is incorrect" });
    }

    const createTokenData: TokenPayload = {
      id: user.id,
      name: user.name,
    };

    const token = jwt.sign(
      createTokenData,
      process.env.PASSWORD_JWT as Secret,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(500).json({ message: error });
    }

    return res
      .status(500)
      .json({ message: "Failed when trying to login: " + error.message });
  }
};

export const updateUser = async (req: MyReq, res: Response) => {
  const idUser = req.userData?.id;
  try {
    const { name, email, password } = createUserBody.parse(req.body);

    const checkEmail = await knex("users")
      .whereNot({ id: idUser })
      .andWhere({ email })
      .first();

    if (checkEmail) {
      return res
        .status(401)
        .json({ message: "The email provided already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await knex("users")
      .update({ name, email, password: encryptedPassword })
      .where({ id: idUser });

    return res.status(200).json();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(401).json(error.errors);
    }

    return res
      .status(500)
      .json({ message: "Failed when trying to update user: " + error.message });
  }
};
