import express from "express";
import {
  addReviewOnBook,
  getBookReviews,
  getMainReviews,
} from "../controllers/reviews.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const ReviewsRoute = express.Router();
ReviewsRoute.use(express.json());

ReviewsRoute.get("/:bookId", errorWrapper(getBookReviews));
ReviewsRoute.post("/:bookId", errorWrapper(addReviewOnBook));
ReviewsRoute.get("/", errorWrapper(getMainReviews));

export default ReviewsRoute;
