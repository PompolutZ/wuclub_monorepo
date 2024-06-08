import express, { json } from "express";
import { privateRouter, publicRouter } from "./routes";

const app = express();

app.use(json());
app.use("/v2", privateRouter, publicRouter);

export { app };
