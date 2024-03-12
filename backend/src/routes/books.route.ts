import express from "express";
import {
  getBestBooks,
  getBook,
  getBooks,
  getCategories,
} from "../controllers/books.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const BooksRoute = express.Router();
BooksRoute.use(express.json());

BooksRoute.get("/", errorWrapper(getBooks));
BooksRoute.get("/categories", errorWrapper(getCategories));
BooksRoute.get("/best", errorWrapper(getBestBooks));
BooksRoute.get("/:bookId", errorWrapper(getBook));

export default BooksRoute;
