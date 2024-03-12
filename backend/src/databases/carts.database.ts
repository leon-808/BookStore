import httpCode from "http-status-codes";
import { Connection, RowDataPacket } from "mysql2/promise";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { transactionWrapper } from "../middlewares/common/transactionWrapper.middleware";
import { Cart } from "../models/cart.model";

export const insertBookToCart = async (
  conn: Connection,
  book_id: number,
  quantity: number,
  userId: number
): Promise<number | void> => {
  let sql =
    "select count(*) as count from cart where user_id = ? and book_id = ?";
  let values = [userId, book_id];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result[0].count !== 0) throw new Error(ERROR_STRING.DuplicateRequest);

  const callback = async () => {
    sql = "insert into cart(user_id, book_id, quantity) values(?, ?, ?)";
    values = [userId, book_id, quantity];
    await conn.execute(sql, values);
    return httpCode.CREATED;
  };

  return await transactionWrapper(conn, callback);
};

export const selectBooksInCart = async (
  conn: Connection,
  userId: number
): Promise<Cart[]> => {
  let sql = `
  select c.*, b.title, b.summary, b.price
  from cart c
  join book b on b.id = c.book_id
  where user_id = ?;
  `;
  let values = [userId];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  return result as Cart[];
};

export const deleteItemInCart = async (
  conn: Connection,
  cartId: number,
  userId: number
): Promise<number | void> => {
  let sql = "select count(*) as count from cart where id = ? and user_id = ?";
  let values = [cartId, userId];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result[0].count === 0) throw new Error(ERROR_STRING.DataNotFound);

  const callback = async () => {
    sql = "delete from cart where id = ?";
    values = [cartId];
    await conn.execute(sql, values);
    return httpCode.OK;
  };

  return await transactionWrapper(conn, callback);
};
