import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";

import publicDecksRouter from "./resources/public-decks/public-deck.router.js";
import decksRouter from "./resources/decks/deck.router.js";
import userDecksRouter from "./resources/user-decks/user-decks.router.js";
import cardRatingsRouter from "./resources/cards-ratings/cards-ratings.router.js";
import { initializeFirebase } from "./middleware/firebase/fbadmin.js";
import { connect } from "./utils/db.js";

config();

const app = express();
const port = process.env.PORT;

initializeFirebase();

app.disable("x-powered-by");

app.use(cors());
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

async function init() {
    await connect();
    app.use("/api/v1/public-decks", publicDecksRouter);
    app.use("/api/v1/decks", decksRouter);
    app.use("/api/v1/user-decks", userDecksRouter);
    app.use("/api/v1/cards-ratings", cardRatingsRouter);

    app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

init();
