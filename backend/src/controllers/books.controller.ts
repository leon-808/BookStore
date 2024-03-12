import httpCode from "http-status-codes";
import {
  selectAllCategories,
  selectBestBooks,
  selectBookById,
  selectBooksByParams,
} from "../databases/books.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { userIdFromToken } from "../middlewares/jsonwebtoken.middleware";
import { ControllerFunctions } from "../types";

export const getCategories: ControllerFunctions = async (request, response) => {
  const result = await databaseConnector(selectAllCategories)();
  response.status(httpCode.OK).json(result);
};

export const getBooks: ControllerFunctions = async (request, response) => {
  const { category_id, news, currentPage = "1", limit = "8" } = request.query;
  const isNews = news === "true" ? true : false;
  const result = await databaseConnector(selectBooksByParams)(
    category_id === "0" || category_id === undefined
      ? undefined
      : Number(category_id),
    Number(currentPage),
    Number(limit),
    isNews
  );
  response.status(httpCode.OK).json(result);
};

export const getBook: ControllerFunctions = async (request, response) => {
  const { bookId } = request.params;
  if (isNaN(Number(bookId))) throw new Error(ERROR_STRING.WrongRequest);
  const token = request.headers.authorization?.split("Bearer ")[1];
  let userId;
  if (!token || token === "undefined" || token === "null") userId = undefined;
  else userId = await userIdFromToken(request);
  const result = await databaseConnector(selectBookById)(
    Number(bookId),
    userId
  );
  response.status(httpCode.OK).json(result);
};

export const getBestBooks: ControllerFunctions = async (request, response) => {
  const result = await databaseConnector(selectBestBooks)();
  response.status(httpCode.OK).json(result);
};
