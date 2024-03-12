import httpCode from "http-status-codes";
import { RowDataPacket } from "mysql2";
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

export const userData = {
  test: {
    email: "test@example.com",
    password: "test",
  },
  fake: {
    email: "fake@example.com",
    password: "change",
  },
  constant: {
    id: 61,
    email: "constant@example.com",
    password: "constant",
  },
  already: {
    email: "already@example.com",
    token: "alreadyToken",
  },
  expired: {
    email: "expired@example.com",
    token: "expiredToken",
  },
  reset: {
    email: "reset@example.com",
    password: "reset",
  },
  failConstant: {
    email: "constant@example.com",
    password: "notConstant",
  },
};

const selectToken = async (
  conn: Connection,
  type: keyof typeof userData
): Promise<string> => {
  const sql = `
  select token 
  from password_reset_token prt
  join user u on u.id = prt.user_id
  where u.email = ?;
  `;
  const values = [userData[type].email];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);
  return result[0].token;
};

const cleanUp = async (conn: Connection): Promise<void> => {
  let sql = "delete from user where email = ?";
  let values: (string | number)[] = [userData.test.email];
  await conn.execute(sql, values);

  sql =
    "update password_reset_token set token = null, expiration = '2000-01-01' where user_id = ?";
  values = [userData.constant.id];
  await conn.execute(sql, values);

  sql = "update user set password = 'beforeReset' where email = ?";
  values = [userData.reset.email];
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

describe("POST /users", () => {
  test("회원 가입", async () => {
    const response = await request(app).post("/users").send(userData.test);
    expect(response.status).toBe(httpCode.CREATED);
  });

  test("중복 회원 존재", async () => {
    const response = await request(app).post("/users").send(userData.constant);
    expect(response.status).toBe(codeByError[ERROR_STRING.DuplicateRequest]);
    expect(response.text).toBe(messageByError[ERROR_STRING.DuplicateRequest]);
  });
});

describe("PATCH /users/reset", () => {
  test("존재하지 않는 이메일 요청", async () => {
    const response = await request(app)
      .patch("/users/reset")
      .send(userData.fake);
    expect(response.status).toBe(codeByError[ERROR_STRING.UserNotFound]);
    expect(response.text).toBe(messageByError[ERROR_STRING.UserNotFound]);
  });

  test("정상적인 이메일 요청", async () => {
    const response = await request(app)
      .patch("/users/reset")
      .send(userData.constant);
    expect(response.status).toBe(httpCode.CREATED);
  });

  test("시간상 유효한 이메일이 존재", async () => {
    const response = await request(app)
      .patch("/users/reset")
      .send(userData.already);
    expect(response.status).toBe(codeByError[ERROR_STRING.DuplicateRequest]);
    expect(response.text).toBe(messageByError[ERROR_STRING.DuplicateRequest]);
  });
});

describe("POST /users/reset", () => {
  test("존재하지 않는 토큰 요청", async () => {
    const response = await request(app)
      .post("/users/reset")
      .send({ token: "token" });
    expect(response.status).toBe(codeByError[ERROR_STRING.UserNotFound]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.UserNotFound]);
  });

  test("유효한 토큰 요청", async () => {
    const response = await request(app)
      .post("/users/reset")
      .send({ token: userData.already.token });
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(userData.already.email);
  });

  test("유효 기간이 지난 토큰 요청", async () => {
    const response = await request(app)
      .post("/users/reset")
      .send({ token: userData.expired.token });
    expect(response.status).toBe(codeByError[ERROR_STRING.ExpiredRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.ExpiredRequest]);
  });
});

describe("PUT /users/reset", () => {
  test("존재하지 않는 이메일 요청", async () => {
    const response = await request(app).put("/users/reset").send(userData.fake);
    expect(response.status).toBe(codeByError[ERROR_STRING.UserNotFound]);
    expect(response.text).toBe(messageByError[ERROR_STRING.UserNotFound]);
  });

  test("유효한 요청", async () => {
    const response = await request(app)
      .put("/users/reset")
      .send(userData.reset);
    expect(response.status).toBe(httpCode.OK);
  });
});

describe("POST /users/login", () => {
  test("존재하지 않는 이메일 요청", async () => {
    const response = await request(app)
      .post("/users/login")
      .send(userData.fake);
    expect(response.status).toBe(codeByError[ERROR_STRING.UserNotFound]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.UserNotFound]);
  });

  test("틀린 비밀번호", async () => {
    const response = await request(app)
      .post("/users/login")
      .send(userData.failConstant);
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongPassword]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongPassword]);
  });

  test("유저 Constant 로그인", async () => {
    const response = await request(app)
      .post("/users/login")
      .send(userData.constant);
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toHaveProperty("token");
  });
});
