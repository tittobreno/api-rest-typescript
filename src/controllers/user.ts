import { Request, Response } from "express";
import knex from "../database/dbConnect";
import bcrypt from "bcrypt";
import { createUserBody, signInBody } from "../validation/schemaUser";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import { UserModel } from "../models/user";

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
    return res
      .status(500)
      .json({ message: "Internal server error" + " " + error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  interface Payload {
    id: string;
    email: string;
  }

  try {
    const { email, password } = signInBody.parse(req.body);

    const user: UserModel = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    const checkIfPasswordIsCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkIfPasswordIsCorrect) {
      res.status(401).json({ message: "Email and/or password is incorrect" });
    }

    const createTokenData: Payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      createTokenData,
      process.env.PASSWORD_JWT as Secret,
      {
        expiresIn: "8h",
      }
    );

    const { password: p, created_at: c, ...userData } = user;

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error:" + " " + error });
  }
};
