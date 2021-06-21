import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";

import publicDecksRouter from "./resources/public-decks/public-deck.router.js";

config();

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.use(cors());
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/public-decks', publicDecksRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}`));
