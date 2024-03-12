import httpCode from "http-status-codes";
import {
  insertOrder,
  selectOrder,
  selectOrders,
} from "../databases/orders.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { userIdFromToken } from "../middlewares/jsonwebtoken.middleware";
import { ControllerFunctions } from "../types";

export const addOrder: ControllerFunctions = async (request, response) => {
  const orderData = request.body;
  if (!orderData || Object.keys(orderData).length === 0)
    throw new Error(ERROR_STRING.NoRequireData);
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(insertOrder)(orderData, userId);
  response.status(result).send();
};

export const getOrders: ControllerFunctions = async (request, response) => {
  const userId = await userIdFromToken(request);
  if (!userId) throw new Error(ERROR_STRING.NoWebTokenError);
  const result = await databaseConnector(selectOrders)(userId);
  response.status(httpCode.OK).send(result);
};

export const getOrder: ControllerFunctions = async (request, response) => {
  const { orderId } = request.params;
  if (isNaN(Number(orderId))) throw new Error(ERROR_STRING.WrongRequest);
  const userId = await userIdFromToken(request);
  if (!userId) throw new Error(ERROR_STRING.NoWebTokenError);
  const result = await databaseConnector(selectOrder)(Number(orderId), userId);
  response.status(httpCode.OK).json(result);
};
