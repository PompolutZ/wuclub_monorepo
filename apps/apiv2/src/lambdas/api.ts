import servelessExpress from "@codegenie/serverless-express";
import { app } from "../app";

export const handler = servelessExpress({ app });
