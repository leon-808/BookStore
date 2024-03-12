import httpCode from "http-status-codes";
import { Connection } from "mysql2/promise";
import request from "supertest";
import app from "../app";
import Database from "../db";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import {
  ERROR_STRING,
  codeByError,
  messageByError,
} from "../middlewares/common/errorHandler.middleware";
import { issueToken } from "../middlewares/jsonwebtoken.middleware";
import { USER_ID } from "./CONSTANT";

const orderSheet = {
  items: [1],
  totalQuantity: 3,
  totalPrice: 30000,
  firstBookTitle: "책1",
  delivery: {
    address: "서울특별시 한강대로 1",
    addressDetail: "2층",
    receiver: "홍길동",
    contact: "010-1234-5678",
  },
};

const orderData = [
  {
    id: 17,
    created_at: "2024-03-04 20:55:43",
    address: "충청남도 아산시 모종로 3",
    receiver: "심청이",
    contact: "010-1234-1234",
    book_title: "책1",
    totalQuantity: 5,
    totalPrice: 90000,
  },
];

const orderDetailData = [
  {
    author: "작가1",
    bookId: 1,
    price: 10000,
    quantity: 3,
    title: "책1",
  },
  {
    author: "작가3",
    bookId: 3,
    price: 30000,
    quantity: 2,
    title: "책3",
  },
];

const cleanUp = async (conn: Connection): Promise<void> => {
  let sql = "delete from receiver where user_id = ?";
  let values = [USER_ID.ORDER_USER];
  await conn.execute(sql, values);

  sql = "delete from orders where user_id = ?";
  values = [USER_ID.ORDER_USER];
  await conn.execute(sql, values);
  return;
};

beforeAll(async () => {
  Database.switchToTest();
});

afterAll(async () => {
  try {
    await databaseConnector(cleanUp)();
    Database.closePool();
  } catch (error) {
    console.error("클린업 도중 에러 발생", error);
  }
});

describe("POST /orders 주문 확정", () => {
  test("주문 데이터가 전달되지 않음", async () => {
    const response = await request(app).post("/orders");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoRequireData]);
    expect(response.text).toBe(messageByError[ERROR_STRING.NoRequireData]);
  });

  test("로그인 사용자 토큰이 전달되지 않음", async () => {
    const response = await request(app).post("/orders").send(orderSheet);
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });

  test("장바구니 ID 1번 주문 확정", async () => {
    const token = issueToken(USER_ID.ORDER_USER);
    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(orderSheet);
    expect(response.status).toBe(httpCode.OK);
  });
});

describe("GET /orders 주문 확인", () => {
  test("로그인 사용자 토큰이 전달되지 않음", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });

  test("CONSTANT_USER 주문 내역", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(orderData);
  });
});

describe("GET /orders/:orderId 주문 상세 확인", () => {
  test("orderId 잘못됨", async () => {
    const response = await request(app).get("/orders/bla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });

  test("토큰 없음", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app).get("/orders/17");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });

  test("결과 없음", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .get("/orders/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(codeByError[ERROR_STRING.DataNotFound]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.DataNotFound]);
  });

  test("ID 17, CONSTANT_USER 주문 내역", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .get("/orders/17")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(orderDetailData);
  });
});
