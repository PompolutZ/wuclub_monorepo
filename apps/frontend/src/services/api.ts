import { AppRoutes } from "@api";
import { hc } from "hono/client";

const api = hc<AppRoutes>("http://localhost:8181/");
