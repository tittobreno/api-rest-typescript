import "dotenv/config";
import { NextFunction, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import z from "zod";
import { MyReq, TokenPayload } from "../../@types";
import { authorizationHeaderSchema } from "../validation/schemaUser";

const authenticateUser = (req: MyReq, res: Response, next: NextFunction) => {
  try {
    const { authorization } = authorizationHeaderSchema.parse(req.headers);

    const token = authorization.split(" ")[1];

    const user = jwt.verify(
      token,
      process.env.PASSWORD_JWT as Secret
    ) as TokenPayload;

    req.userData = user;

    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(401).json({ message: error });
    }

    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default authenticateUser;
