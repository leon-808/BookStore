import path from "path";
import code from "http-status-codes";
const __dirname = path.resolve();
import Database from "../../db.js";
const db = Database.getInstance();

import { errDB } from "../middleware/repositoryErrorHandler.middleware.js";
import { selectNewest5 } from "../repositories/main.repositories.js";

export const main_page = (req, res) => {
  res.sendFile(path.join(__dirname, "/views/main.html"));
};

export const getNewestBooks = async (req, res) => {
  const result = await errDB(selectNewest5);
  res.status(code.OK).json(result);
};
