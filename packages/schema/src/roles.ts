import { z } from "zod";

export const rolesSchema = z.enum(["User", "Katophrane"]);
export type Role = z.infer<typeof rolesSchema>;

// Homage to the Katophrane artefacts from season 1 of Warhammer Underworlds.
export const ADMIN_ROLE: Role = "Katophrane";
