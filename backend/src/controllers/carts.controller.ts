import httpCode from "http-status-codes";
import {
  deleteItemInCart,
  insertBookToCart,
  selectBooksInCart,
} from "../databases/carts.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { userIdFromToken } from "../middlewares/jsonwebtoken.middleware";
import { ControllerFunctions } from "../types";

export const addBookToCart: ControllerFunctions = async (request, response) => {
  const { book_id, quantity } = request.body;
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(insertBookToCart)(
    book_id,
    quantity,
    userId
  );
  response.status(result).send();
};

export const getCartList: ControllerFunctions = async (request, response) => {
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(selectBooksInCart)(userId);
  response.status(httpCode.OK).json(result);
};

export const removeItemFromCart: ControllerFunctions = async (
  request,
  response
) => {
  const { cartId } = request.params;
  if (isNaN(Number(cartId))) throw new Error(ERROR_STRING.WrongRequest);
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(deleteItemInCart)(
    Number(cartId),
    userId
  );
  response.status(result).send();
};
