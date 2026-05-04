import { z } from "zod";

export const rolesSchema = z.enum(["User", "Player", "Katophrane"]);
export type Role = z.infer<typeof rolesSchema>;

// Homage to the Katophrane artefacts from season 1 of Warhammer Underworlds.
export const ADMIN_ROLE: Role = "Katophrane";
export const PLAYER_ROLE: Role = "Player";
