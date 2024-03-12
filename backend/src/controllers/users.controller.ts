import httpCode from "http-status-codes";
import {
  insertUser,
  preResetPasswordTasks,
  selectUserEmailbyEnableToken,
  selectUserforLogin,
  updateUserPassword,
} from "../databases/users.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { genHashedPassword } from "../middlewares/genHashedPassword.middleware";
import { ControllerFunctions } from "../types";

export const joinNewUser: ControllerFunctions = async (request, response) => {
  const { email, password } = request.body;
  const hashedPassword = await genHashedPassword(password);
  const result = await databaseConnector(insertUser)(email, hashedPassword);
  response.status(result).send();
};

export const patchUserPasswordResetRequest: ControllerFunctions = async (
  request,
  response
) => {
  const { email } = request.body;
  const result = await databaseConnector(preResetPasswordTasks)(email);
  response.status(result).send();
};

export const verifyPasswordResetToken: ControllerFunctions = async (
  request,
  response
) => {
  const { token } = request.body;
  const result = await databaseConnector(selectUserEmailbyEnableToken)(token);
  response.status(httpCode.OK).json(result);
};

export const resetUserPassword: ControllerFunctions = async (
  request,
  response
) => {
  const { email, password } = request.body;
  const result = await databaseConnector(updateUserPassword)(email, password);
  response.status(result).send();
};

export const proceedLogin: ControllerFunctions = async (request, response) => {
  const { email, password } = request.body;
  const result = await databaseConnector(selectUserforLogin)(email, password);
  response.status(httpCode.OK).json(result);
};
