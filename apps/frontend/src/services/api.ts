import { hc } from "hono/client";
import type { AppRoutes } from "./app";

export const api = hc<AppRoutes>(import.meta.env.VITE_API_BASE_URL);
