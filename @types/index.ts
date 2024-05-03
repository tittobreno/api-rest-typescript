import { Request } from "express";

export interface MyReq extends Request {
  userData?: {
    id: string;
    name: string;
  };
}

export interface TokenPayload {
  id: string;
  name: string;
}
