import httpCode from "http-status-codes";
import { Connection } from "mysql2/promise";
import request from "supertest";
import app from "../app";
import { selectMainReview } from "../databases/reviews.database";
import Database from "../db";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import {
  ERROR_STRING,
  codeByError,
  messageByError,
} from "../middlewares/common/errorHandler.middleware";
import {
  issueExpiredToken,
  issueToken,
} from "../middlewares/jsonwebtoken.middleware";
import { USER_ID } from "./CONSTANT";

const book1ReviewData = [
  {
    id: 1,
    userId: 61,
    content: "정말 재밌어요.",
    score: 3,
    created_at: "2024-03-07 15:57:37",
    email: "constant@example.com",
  },
  {
    id: 2,
    userId: 65,
    content: "흥미롭습니다.",
    score: 4,
    created_at: "2024-03-07 15:58:07",
    email: "already@example.com",
  },
];

const cleanUp = async (conn: Connection): Promise<void> => {
  let sql = "delete from review where user_id = ?";
  let values = [USER_ID.REVIEW_USER];
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

describe("GET /:bookId 도서별 리뷰", () => {
  test("잘못된 Id", async () => {
    const response = await request(app).get("/reviews/blabla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });

  test("Id 가 1인 책의 리뷰들", async () => {
    const response = await request(app).get("/reviews/1");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(book1ReviewData);
  });
});

describe("POST /:bookId 리뷰 등록", () => {
  test("잘못된 Id", async () => {
    const response = await request(app).post("/reviews/blabla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });

  test("토큰 없음", async () => {
    const response = await request(app).post("/reviews/1");
    expect(response.status).toBe(codeByError[ERROR_STRING.NoWebTokenError]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.NoWebTokenError]);
  });

  test("유효 기간이 지난 토큰", async () => {
    const token = await issueExpiredToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .post("/reviews/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(codeByError[ERROR_STRING.TokenExpiredError]);
    expect(response.text).toEqual(
      messageByError[ERROR_STRING.TokenExpiredError]
    );
  });

  test("맞지 않는 토큰", async () => {
    const response = await request(app)
      .post("/reviews/1")
      .set("Authorization", "Bearer Token");
    expect(response.status).toBe(codeByError[ERROR_STRING.JsonWebTokenError]);
    expect(response.text).toEqual(
      messageByError[ERROR_STRING.JsonWebTokenError]
    );
  });

  test("REVIEW_USER 리뷰 등록", async () => {
    const token = issueToken(USER_ID.REVIEW_USER);
    const response = await request(app)
      .post("/reviews/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "감명 깊은 책입니다.",
        score: 5,
      });
    expect(response.status).toBe(httpCode.CREATED);
  });

  test("CONSTANT_USER 중복 리뷰 등록", async () => {
    const token = issueToken(USER_ID.CONSTANT_USER);
    const response = await request(app)
      .post("/reviews/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "감명 깊은 책입니다.",
        score: 5,
      });
    expect(response.status).toBe(codeByError[ERROR_STRING.DuplicateRequest]);
    expect(response.text).toBe(messageByError[ERROR_STRING.DuplicateRequest]);
  });
});

describe("GET /", () => {
  test("6개 최신순 정렬", async () => {
    const result = await databaseConnector(selectMainReview)();
    const response = await request(app).get("/reviews");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });
});
