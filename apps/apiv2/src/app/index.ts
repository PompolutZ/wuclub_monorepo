import express, { json } from "express";
import { router } from "./routes";

const app = express();

app.use(json());
app.use("/v2", router);

export { app };
