import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export type User = {
  fuid: string;
  avatar: string;
  displayName: string;
  role: string[];
};

export interface ApiRequest extends Request {
  claims: DecodedIdToken;
}
