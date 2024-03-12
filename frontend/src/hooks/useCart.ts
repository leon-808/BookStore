import { useEffect, useState } from "react";
import { Cart } from "../../../backend/src/models/cart.model";
import { deleteCart, fetchCart } from "../api/carts.api";

export const useCart = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const deleteCartItem = (id: number) => {
    deleteCart(id).then((response) =>
      setCarts(carts.filter((item) => item.id !== id))
    );
  };

  useEffect(() => {
    fetchCart().then((response): void => {
      setCarts(response.data);
      setIsEmpty(response.data.length === 0);
    });
  }, []);

  return { carts, isEmpty, deleteCartItem };
};
