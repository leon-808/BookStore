import httpCode from "http-status-codes";
import { selectBanners } from "../databases/banners.database";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import { ControllerFunctions } from "../types";

export const getBanners: ControllerFunctions = async (request, response) => {
  const result = await databaseConnector(selectBanners)();
  response.status(httpCode.OK).json(result);
};
