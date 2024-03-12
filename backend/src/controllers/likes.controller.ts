import { toggleLike } from "../databases/likes.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { userIdFromToken } from "../middlewares/jsonwebtoken.middleware";
import { ControllerFunctions } from "../types";

export const likeBookToggle: ControllerFunctions = async (
  request,
  response
) => {
  const { bookId } = request.params;
  if (isNaN(Number(bookId))) throw new Error(ERROR_STRING.WrongRequest);
  const userId = await userIdFromToken(request);
  const result = await databaseConnector(toggleLike)(Number(bookId), userId);
  response.status(result).send();
};
