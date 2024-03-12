import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Delivery, OrderSheet } from "../../../backend/src/models/order.model";
import { order } from "../api/order.api";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/common/Button";
import InputText from "../components/common/InputText";
import Title from "../components/common/Title";
import FindAddressButton from "../components/order/FindAddressButton";
import { useAlert } from "../hooks/useAlert";
import { useAuthStore } from "../store/authStore";
import { CartStyle } from "./Cart";

const Order = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDataFromCart = location.state;

  const { isLoggedIn } = useAuthStore();
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    if (!isLoggedIn) {
      showAlert("로그인을 해야 이용 가능합니다.");
      navigate("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Delivery>();

  const handlePay = (data: Delivery) => {
    const orderData: OrderSheet = {
      ...orderDataFromCart,
      delivery: {
        ...data,
      },
    };
    showConfirm("주문하시겠습니까?", () =>
      order(orderData).then(
        (response) => showAlert("주문이 완료되었습니다.")
        // navigate("/orderlist");
      )
    );
  };

  if (orderDataFromCart) {
    const { totalQuantity, totalPrice, firstBookTitle } = orderDataFromCart;

    return (
      <>
        <Title size="large">주문서 작성</Title>
        <CartStyle>
          <div className="content">
            <div className="order-info">
              <Title size="medium" color="text">
                배송 정보
              </Title>
              <form className="delivery">
                <fieldset>
                  <label>주소</label>
                  <div className="input">
                    <InputText
                      inputType="text"
                      {...register("address", { required: true })}
                    ></InputText>
                  </div>
                  <FindAddressButton
                    onCompleted={(address) => {
                      setValue("address", address);
                    }}
                  />
                </fieldset>
                {errors.address && (
                  <p className="error-text">주소를 입력해 주세요.</p>
                )}
                <fieldset>
                  <label>상세 주소</label>
                  <div className="input">
                    <InputText
                      inputType="text"
                      {...register("addressDetail", { required: true })}
                    ></InputText>
                  </div>
                </fieldset>
                {errors.addressDetail && <p>상세 주소를 입력해 주세요.</p>}
                <fieldset>
                  <label>수령인</label>
                  <div className="input">
                    <InputText
                      inputType="text"
                      {...register("receiver", { required: true })}
                    ></InputText>
                  </div>
                </fieldset>
                {errors.receiver && <p>수령인을 입력해 주세요.</p>}
                <fieldset>
                  <label>전화번호</label>
                  <div className="input">
                    <InputText
                      inputType="text"
                      {...register("contact", { required: true })}
                    ></InputText>
                  </div>
                </fieldset>
                {errors.contact && <p>전화번호를 입력해 주세요.</p>}
              </form>
            </div>
            <div className="order-info">
              <Title size="medium" color="text">
                주문 상품
              </Title>
              <strong>
                {firstBookTitle} 등 총 {totalQuantity} 권
              </strong>
            </div>
          </div>
          <div className="summary">
            <CartSummary
              totalQuantity={totalQuantity}
              totalPrice={totalPrice}
            ></CartSummary>
            <Button
              size="large"
              scheme="primary"
              onClick={handleSubmit(handlePay)}
            >
              결제하기
            </Button>
          </div>
        </CartStyle>
      </>
    );
  } else return <>주문 내역이 없습니다</>;
};

const OrderStyle = styled.div``;

export default Order;
