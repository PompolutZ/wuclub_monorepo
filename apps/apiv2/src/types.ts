import { Request } from "express";
import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId;
  fuid: string;
  avatar: string;
  displayName: string;
  role: string[];
};

export interface ApiRequest extends Request {
  user?: User;
}
