import express from "express";
import {
  addBookToCart,
  getCartList,
  removeItemFromCart,
} from "../controllers/carts.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const CartsRoute = express.Router();
CartsRoute.use(express.json());

CartsRoute.post("/", errorWrapper(addBookToCart));
CartsRoute.get("/", errorWrapper(getCartList));
CartsRoute.delete("/:cartId", errorWrapper(removeItemFromCart));

export default CartsRoute;
