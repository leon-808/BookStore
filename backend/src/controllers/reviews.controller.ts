import httpCode from "http-status-codes";
import {
  insertReviewOnBook,
  selectMainReview,
  selectReviewByBook,
} from "../databases/reviews.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { userIdFromToken } from "../middlewares/jsonwebtoken.middleware";
import { ControllerFunctions } from "../types";

export const getBookReviews: ControllerFunctions = async (
  request,
  response
) => {
  const { bookId } = request.params;
  if (isNaN(Number(bookId))) throw new Error(ERROR_STRING.WrongRequest);
  const result = await databaseConnector(selectReviewByBook)(Number(bookId));
  response.status(httpCode.OK).json(result);
};

export const addReviewOnBook: ControllerFunctions = async (
  request,
  response
) => {
  const { bookId } = request.params;
  const { content, score } = request.body;
  if (isNaN(Number(bookId))) throw new Error(ERROR_STRING.WrongRequest);
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(insertReviewOnBook)(
    Number(bookId),
    userId,
    content,
    score
  );
  response.status(result).send();
};

export const getMainReviews: ControllerFunctions = async (
  request,
  response
) => {
  const result = await databaseConnector(selectMainReview)();
  response.status(httpCode.OK).send(result);
};
