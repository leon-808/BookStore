import { Cart } from "../../../backend/src/models/cart.model";
import { getToken } from "../store/authStore";
import { httpClient } from "./http";

interface AddCartParams {
  book_id: number;
  quantity: number;
}

export const addCart = async (body: AddCartParams) => {
  const token = getToken();
  return await httpClient.post("/carts", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchCart = async () => {
  const token = getToken();
  return await httpClient.get<Cart[]>("/carts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCart = async (cartId: number) => {
  const token = getToken();
  return await httpClient.delete(`/carts/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
