import { z } from "zod";

export const formats = z.enum([
  "CHAMPIONSHIP",
  "OPEN",
  "RELIC",
  "VANGUARD",
  "NEMESIS",
  "RIVALS",
]);

export type Format = z.infer<typeof formats>;
