import {
  Order,
  OrderDetailItem,
  OrderSheet,
} from "../../../backend/src/models/order.model";
import { getToken } from "../store/authStore";
import { httpClient } from "./http";

export const order = async (orderData: OrderSheet) => {
  const token = getToken();
  const response = await httpClient.post("/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchOrders = async () => {
  const token = getToken();
  const response = await httpClient.get<Order[]>("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchOrder = async (orderId: number) => {
  const token = getToken();
  const response = await httpClient.get<OrderDetailItem[]>(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
