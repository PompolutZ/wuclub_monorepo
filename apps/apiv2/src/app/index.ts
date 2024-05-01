import express, { json } from "express";

const app = express();

app.use(json());

app.get("/health", async (req, res) => {
  res.status(200).send("Ok");
});

export { app };
