import httpCode from "http-status-codes";
import { Connection, RowDataPacket } from "mysql2/promise";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { transactionWrapper } from "../middlewares/common/transactionWrapper.middleware";
import { genHashedPassword } from "../middlewares/genHashedPassword.middleware";
import { genRandomTokenUrl } from "../middlewares/genRandomTokenUrl.middleware";
import { isBrowserTimeEarly } from "../middlewares/isBrowserTimeEarly.middleware";
import { issueToken } from "../middlewares/jsonwebtoken.middleware";
import { sendEmail } from "../middlewares/sendEmail.middleware";
import { Jsonwebtoken } from "../models/jsonwebtoken.model";
import { User } from "../models/user.model";

export const insertUser = async (
  conn: Connection,
  email: User,
  hashedPassword: User
): Promise<number | void> => {
  let sql = "select id from user where email = ?";
  let values: (User | string | number)[] = [email];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length !== 0) throw new Error(ERROR_STRING.DuplicateRequest);

  const callback = async () => {
    sql = "insert into user(email, password) values(?, ?)";
    values = [email, hashedPassword];
    await conn.execute(sql, values);

    sql = "select id from user where email = ?";
    values = [email];
    [result] = await conn.execute<RowDataPacket[]>(sql, values);
    const id = result[0].id;

    sql = "insert into password_reset_token(user_id) values(?)";
    values = [id];
    await conn.execute(sql, values);

    return httpCode.CREATED;
  };

  return await transactionWrapper(conn, callback);
};

export const preResetPasswordTasks = async (
  conn: Connection,
  email: User
): Promise<number | void> => {
  let sql = "select id from user where email = ?";
  let values = [email];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length === 0) throw new Error(ERROR_STRING.UserNotFound);
  const id = result[0].id;

  const token = genRandomTokenUrl();

  sql = "select expiration from password_reset_token where user_id = ?";
  values = [id];
  [result] = await conn.execute<RowDataPacket[]>(sql, values);
  const serverTime = result[0]?.expiration;
  if (isBrowserTimeEarly(serverTime))
    throw new Error(ERROR_STRING.DuplicateRequest);

  const callback = async () => {
    sql = `
    update password_reset_token
    set token = ?, expiration = date_add(now(), interval 10 minute)
    where user_id = ?
    `;
    values = [token, id];
    await conn.execute(sql, values);

    await sendEmail(email, token);

    return httpCode.CREATED;
  };

  return await transactionWrapper(conn, callback);
};

export const selectUserEmailbyEnableToken = async (
  conn: Connection,
  token: string
): Promise<string> => {
  let sql = `
  select u.email, prt.expiration
  from user u
  join password_reset_token prt on u.id = prt.user_id
  where prt.token = ?
  `;
  let values = [token];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  const serverTime = result[0]?.expiration;
  if (result.length === 0) throw new Error(ERROR_STRING.UserNotFound);
  if (!isBrowserTimeEarly(serverTime))
    throw new Error(ERROR_STRING.ExpiredRequest);
  return result[0].email;
};

export const updateUserPassword = async (
  conn: Connection,
  email: User,
  password: string
): Promise<number | void> => {
  let sql = "select count(*) as count from user where email = ?";
  let values: (User | string)[] = [email];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result[0].count === 0) throw new Error(ERROR_STRING.UserNotFound);

  const hashedPassword = await genHashedPassword(password);

  const callback = async () => {
    sql = "update user set password = ? where email = ?";
    values = [hashedPassword, email];
    await conn.execute(sql, values);
    return httpCode.OK;
  };

  return await transactionWrapper(conn, callback);
};

export const selectUserforLogin = async (
  conn: Connection,
  email: User,
  password: User
): Promise<number | Jsonwebtoken> => {
  let sql = "select id from user where email = ?";
  let values = [email];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length === 0) throw new Error(ERROR_STRING.UserNotFound);

  sql = "select id from user where email = ? and password = ?";
  values.push(password);
  [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length === 0) throw new Error(ERROR_STRING.WrongPassword);

  const id = result[0]?.id;
  const token = issueToken(id);
  return { token: token };
};
