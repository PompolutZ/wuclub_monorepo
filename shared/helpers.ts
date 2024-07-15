import { v4 as uuidv4 } from "uuid";

export const generateDeckId = (prefix: string) =>
  `${prefix}-${uuidv4().split("-").slice(-1)[0]}`;
