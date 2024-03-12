import httpCode from "http-status-codes";
import { Connection, RowDataPacket } from "mysql2/promise";
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

const bookItem = {
  insert: {
    book_id: 2,
    quantity: 4,
  },
  already: {
    book_id: 1,
    quantity: 3,
  },
};

const cartList = [
  {
    id: 1,
    user_id: 61,
    book_id: 1,
    quantity: 3,
    title: "책1",
    summary: "요약1",
    price: 10000,
  },
];

const selectCartId = async (conn: Connection): Promise<number> => {
  let sql = "select id from cart where user_id = ? and book_id = ?";
  let values = [USER_ID.CART_USER, 3];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  return result[0].id;
};

const cleanUp = async (conn: Connection): Promise<void> => {
  let sql = "delete from cart where user_id = ?";
  let values = [USER_ID.CART_USER];
  await conn.execute(sql, values);

  sql = "insert into cart(user_id, book_id, quantity) values(?, ?, ?)";
  values = [USER_ID.CART_USER, 3, 5];
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

describe("POST /carts 장바구니 책 추가", () => {
  test("CART_USER 책 하나 추가", async () => {
    const token = issueToken(USER_ID.CART_USER);
    const response = await request(app)
      .post("/carts")
      .set("Authorization", `Bearer ${token}`)
      .send(bookItem.insert);
    expect(response.status).toBe(httpCode.CREATED);
  });

  test("CONSTANT_USER 이미 장바구니에 있는 책", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .post("/carts")
      .set("Authorization", `Bearer ${token}`)
      .send(bookItem.already);
    expect(response.status).toBe(codeByError[ERROR_STRING.DuplicateRequest]);
    expect(response.text).toEqual(
      messageByError[ERROR_STRING.DuplicateRequest]
    );
  });

  test("비 로그인", async () => {
    const response = await request(app)
      .post("/carts")
      .set("Authorization", "token")
      .send(bookItem.already);
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });
});

describe("GET /carts 장바구니 목록", () => {
  test("CONSTANT_USER 장바구니", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .get("/carts")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(cartList);
  });

  test("비 로그인", async () => {
    const response = await request(app)
      .get("/carts")
      .set("Authorization", "token");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });
});

describe("DELETE /carts/:cartId 장바구니 삭제", () => {
  test("CART_USER 장바구니 책 삭제", async () => {
    const token = issueToken(USER_ID.CART_USER);
    const cartId = await databaseConnector(selectCartId)();
    const response = await request(app)
      .delete(`/carts/${cartId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
  });

  test("Cart Id 가 아님", async () => {
    const response = await request(app).delete("/carts/blabla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });

  test("비 로그인", async () => {
    const response = await request(app).delete("/carts/0");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });
});
