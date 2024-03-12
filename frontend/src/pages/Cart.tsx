import { useEffect, useMemo, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { OrderSheet } from "../../../backend/src/models/order.model";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/common/Button";
import Empty from "../components/common/Empty";
import Title from "../components/common/Title";
import { useAlert } from "../hooks/useAlert";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../store/authStore";

const Cart = (): JSX.Element => {
  const { showAlert, showConfirm } = useAlert();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { carts, isEmpty, deleteCartItem } = useCart();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      showAlert("로그인을 해주세요.");
      navigate("/");
    }
  }, []);

  const handleCheckItem = (id: number) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((element) => element !== id));
    } else setCheckedItems([...checkedItems, id]);
  };

  const handleItemDelete = (id: number) => {
    deleteCartItem(id);
  };

  const totalQuantity = useMemo(() => {
    if (carts.length > 0) {
      return carts.reduce((accumulator: number, item) => {
        if (checkedItems.includes(item.id)) {
          return accumulator + item.quantity;
        }
        return accumulator;
      }, 0);
    } else return 0;
  }, [carts, checkedItems]);

  const totalPrice = useMemo(() => {
    if (carts.length > 0) {
      return carts.reduce((accumulator: number, item) => {
        if (checkedItems.includes(item.id)) {
          return accumulator + item.price;
        }
        return accumulator;
      }, 0);
    } else return 0;
  }, [carts, checkedItems]);

  const handleOrder = () => {
    if (checkedItems.length === 0) {
      showAlert("주문을 확정할 책이 없습니다.");
      return;
    }

    const firstIndex = carts.findIndex((item) => item.id === checkedItems[0]);

    const orderData: Omit<OrderSheet, "delivery"> = {
      items: checkedItems,
      totalPrice,
      totalQuantity,
      firstBookTitle: carts[firstIndex].title,
    };

    showConfirm("주문하시겠습니까?", () =>
      navigate("/order", { state: orderData })
    );
  };

  return (
    <>
      <Title size="large">장바구니</Title>
      <CartStyle>
        <div className="content">
          {!isEmpty &&
            carts.map((item) => (
              <CartItem
                key={item.id}
                cart={item}
                checkedItems={checkedItems}
                onCheck={handleCheckItem}
                onDelete={handleItemDelete}
              />
            ))}
          {isEmpty && (
            <Empty
              title="장바구니가 비었습니다."
              icon={<FaShoppingCart />}
              description={<>장바구니를 채워보세요.</>}
            />
          )}
        </div>
        <div className="summary">
          <CartSummary totalQuantity={totalQuantity} totalPrice={totalPrice} />
          <Button size="large" scheme="primary" onClick={handleOrder}>
            주문하기
          </Button>
        </div>
      </CartStyle>
    </>
  );
};

export const CartStyle = styled.div`
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 24px 0 0 0;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .order-info {
    h1 {
      padding: 0 0 24px 0;
    }

    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    padding: 12px;
  }

  .delivery {
    fieldset {
      border: 0;
      margin: 0;
      padding: 0 0 12px 0;
      display: flex;
      justify-content: start;
      gap: 8px;

      label {
        width: 80px;
      }

      .input {
        flex: 1;
        input {
          width: 100%;
        }
      }
    }
  }

  .error-text {
    color: red;
    margin: 0;
    padding: 0 0 12px 0;
    text-align: right;
  }
`;

export default Cart;
