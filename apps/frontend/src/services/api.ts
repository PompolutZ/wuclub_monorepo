import { hc } from "hono/client";
import type { AppRoutes } from "./app";

export const api = hc<AppRoutes>("http://localhost:8181");
