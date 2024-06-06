import { getOrCreateClient } from "./client";
import { User } from "@/types";

export const getUserByFuid = async (fuid: string): Promise<User> => {
  const client = await getOrCreateClient();
  const [payload] = await client
    .collection("users")
    .find({ fuid }, { projection: { _id: 0 } })
    .toArray();

  return payload as User;
};
