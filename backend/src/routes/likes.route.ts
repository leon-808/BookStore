import express from "express";
import { likeBookToggle } from "../controllers/likes.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const LikesRoute = express.Router();
LikesRoute.use(express.json());

LikesRoute.post("/:bookId", errorWrapper(likeBookToggle));

export default LikesRoute;
