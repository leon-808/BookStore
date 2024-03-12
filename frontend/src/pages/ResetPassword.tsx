import httpCode from "http-status-codes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, resetRequest, verifyResetToken } from "../api/auth.api";
import Button from "../components/common/Button";
import InputText from "../components/common/InputText";
import Title from "../components/common/Title";
import { useAlert } from "../hooks/useAlert";
import { SignupStyle } from "./Signup";

export interface SignupProps {
  email: string;
  password: string;
}

const ResetPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [resetRequested, setResetRequested] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupProps>();

  useEffect(() => {
    if (token) {
      verifyResetToken(token).then((success) => {
        setResetRequested(true);
      });
    }
  }, [token]);

  const onSubmit = (data: SignupProps) => {
    if (resetRequested) {
      resetPassword(data).then(
        (success) => {
          showAlert("비밀번호가 변경되었습니다.");
          navigate("/login");
        },
        (error) => {
          if (error === httpCode.NOT_FOUND)
            showAlert("존재하지 않는 이메일입니다.");
        }
      );
    } else {
      resetRequest(data).then(
        (success) => {
          showAlert("비밀번호 초기화 요청 이메일이 전송되었습니다.");
        },
        (error) => {
          if (error === httpCode.NOT_FOUND)
            showAlert("해당 이메일은 존재하지 않습니다.");
          if (error === httpCode.CONFLICT)
            showAlert("이미 전송된 초기화 요청 이메일이 있습니다.");
        }
      );
    }
  };

  return (
    <>
      <Title size="large">비밀번호 초기화</Title>
      <SignupStyle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <InputText
              placeholder="이메일"
              inputType="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="error-text">이메일을 입력해주세요.</p>
            )}
          </fieldset>
          {resetRequested && (
            <fieldset>
              <InputText
                placeholder="비밀번호"
                inputType="password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="error-text">비밀번호를 입력해주세요.</p>
              )}
            </fieldset>
          )}
          <fieldset>
            <Button type="submit" size="medium" scheme="primary">
              {resetRequested ? "비밀번호 초기화" : "초기화 요청"}
            </Button>
          </fieldset>
        </form>
      </SignupStyle>
    </>
  );
};

export default ResetPassword;
