import { NextFunction, Request, Response } from "express";
import httpCode from "http-status-codes";

export const ERROR_STRING: Record<string, string> = {
  NoWebTokenError: "NoWebTokenError",
  JsonWebTokenError: "JsonWebTokenError",
  TokenExpiredError: "TokenExpiredError",
  NoRequireData: "NoRequireData",
  DataNotFound: "DataNotFound",
  WrongRequest: "WrongRequest",
  DuplicateRequest: "DuplicateRequest",
  ExpiredRequest: "ExpiredRequest",
  UserNotFound: "UserNotFound",
  WrongPassword: "WrongPassword",
};

export const codeByError: Record<string, number> = {
  [ERROR_STRING.NoWebTokenError]: httpCode.UNAUTHORIZED,
  [ERROR_STRING.JsonWebTokenError]: httpCode.UNAUTHORIZED,
  [ERROR_STRING.TokenExpiredError]: httpCode.UNAUTHORIZED,
  [ERROR_STRING.NoRequireData]: httpCode.BAD_REQUEST,
  [ERROR_STRING.DataNotFound]: httpCode.NOT_FOUND,
  [ERROR_STRING.WrongRequest]: httpCode.BAD_REQUEST,
  [ERROR_STRING.DuplicateRequest]: httpCode.CONFLICT,
  [ERROR_STRING.ExpiredRequest]: httpCode.GONE,
  [ERROR_STRING.UserNotFound]: httpCode.UNAUTHORIZED,
  [ERROR_STRING.WrongPassword]: httpCode.UNAUTHORIZED,
};

export const messageByError: Record<string, string> = {
  [ERROR_STRING.NoWebTokenError]: "로그인하지 않았습니다.",
  [ERROR_STRING.JsonWebTokenError]: "사용자 인증 정보에 문제가 있습니다.",
  [ERROR_STRING.TokenExpiredError]: "사용자 인증이 만료되었습니다.",
  [ERROR_STRING.NoRequireData]: "필요한 데이터가 없습니다.",
  [ERROR_STRING.DataNotFound]: "해당 데이터가 존재하지 않습니다.",
  [ERROR_STRING.WrongRequest]: "잘못된 요청 양식입니다.",
  [ERROR_STRING.DuplicateRequest]: "중복된 요청입니다.",
  [ERROR_STRING.ExpiredRequest]: "유효 기간이 지난 요청입니다.",
  [ERROR_STRING.UserNotFound]: "존재하지 않는 사용자입니다.",
  [ERROR_STRING.WrongPassword]: "틀린 비밀번호입니다.",
};

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // console.log(error);
  // console.log(error.message);
  if (ERROR_STRING[error.message]) {
    response
      .status(codeByError[error.message])
      .send(messageByError[error.message]);
  } else {
    response
      .status(httpCode.INTERNAL_SERVER_ERROR)
      .send("서버 측 에러가 발생했습니다");
  }
};
