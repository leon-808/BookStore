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

let token: string;

const cleanUp = async (conn: Connection) => {
  let sql = "insert into likes values(?, 2)";
  let values = [USER_ID.CONSTANT_USER];
  await conn.execute(sql, values);

  sql = "delete from likes where user_id = ? and book_id = 1";
  await conn.execute(sql, values);
  return;
};

beforeAll(async () => {
  Database.switchToTest();
  token = issueToken(USER_ID.CONSTANT_USER);
});

afterAll(async () => {
  await databaseConnector(cleanUp)();
  Database.closePool();
});

describe("POST /likes/:bookId", () => {
  test("bookId 가 아님", async () => {
    const response = await request(app).post("/likes/blabla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });

  test("비 로그인", async () => {
    const response = await request(app).post("/likes/1");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });

  test("bookId 가 1인 책 CONSTANT_USER 의 좋아요 활성화", async () => {
    const response = await request(app)
      .post("/likes/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.CREATED);
  });

  test("bookId 가 2인 책 CONSTANT_USER 의 좋아요 비활성화", async () => {
    const response = await request(app)
      .post("/likes/2")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
  });
});
