import { getOrCreateClient } from "./client";
import { User } from "@/types";

export const getUserByFuid = async (fuid: string): Promise<User> => {
  const client = await getOrCreateClient();
  const [payload] = await client
    .collection("users")
    .find({ fuid }, { projection: { _id: 0 } })
    .toArray();

  return payload as unknown as User;
};

export const setUser = async (user: User): Promise<void> => {
  const client = await getOrCreateClient();
  await client
    .collection("users")
    .updateOne({ fuid: user.fuid }, { $set: user }, { upsert: true });
};
