import express from "express";
import { getBanners } from "../controllers/banners.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const BannersRoute = express.Router();
BannersRoute.use(express.json());

BannersRoute.get("/", errorWrapper(getBanners));

export default BannersRoute;
