import express from "express";
import {
  addOrder,
  getOrder,
  getOrders,
} from "../controllers/orders.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const OrdersRoute = express.Router();
OrdersRoute.use(express.json());

OrdersRoute.post("/", errorWrapper(addOrder));
OrdersRoute.get("/", errorWrapper(getOrders));
OrdersRoute.get("/:orderId", errorWrapper(getOrder));

export default OrdersRoute;
