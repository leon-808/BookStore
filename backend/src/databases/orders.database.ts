import httpCode from "http-status-codes";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { transactionWrapper } from "../middlewares/common/transactionWrapper.middleware";
import { Book } from "../models/book.model";
import { Order, OrderSheet } from "../models/order.model";

export const insertOrder = async (
  conn: Connection,
  orderData: OrderSheet,
  userId: number
): Promise<number | void> => {
  const callback = async () => {
    const { address, addressDetail, receiver, contact } = orderData.delivery;
    const fullAddress = address + " " + addressDetail;

    let sql =
      "insert into receiver(user_id, name, address, contact) values(?, ?, ?, ?)";
    let values = [userId, receiver, fullAddress, contact];
    let [result] = await conn.execute<ResultSetHeader>(sql, values);
    const receiverId = result.insertId;

    sql =
      "insert into orders(user_id, receiver_id, total_quantity, total_price) values(?, ?, ?, ?)";
    values = [
      userId,
      receiverId,
      orderData.totalQuantity,
      orderData.totalPrice,
    ];
    [result] = await conn.execute<ResultSetHeader>(sql, values);
    const orderId = result.insertId;

    for (const cartId of orderData.items) {
      sql = "select book_id, quantity from cart where id = ?";
      values = [cartId];
      const [result] = await conn.execute<RowDataPacket[]>(sql, values);
      const { book_id, quantity } = result[0];

      sql =
        "insert into order_item(order_id, book_id, quantity) values(?, ?, ?)";
      values = [orderId, book_id, quantity];
      await conn.execute(sql, values);
    }

    return httpCode.OK;
  };

  return await transactionWrapper(conn, callback);
};

export const selectOrders = async (
  conn: Connection,
  userId: number
): Promise<Order[]> => {
  let sql = `
  select o.id, o.created_at, r.address, r.name receiver, r.contact, b.title book_title, o.total_quantity totalQuantity, o.total_price totalPrice
  from orders o
  join receiver r on r.id = o.receiver_id
  join (
      select oi.order_id, min(oi.book_id) as first_book
      from order_item oi
      group by oi.order_id
  ) oi on oi.order_id = o.id
  join book b on b.id = first_book
  where o.user_id = ?
  `;
  let values = [userId];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);
  return result as Order[];
};

export const selectOrder = async (
  conn: Connection,
  orderId: number,
  userId: number
): Promise<Book[]> => {
  let sql = `
  select b.author, b.id as bookId, b.price, oi.quantity, b.title
  from order_item oi
  join orders o on o.id = oi.order_id
  join book b on b.id = oi.book_id
  where o.id = ? and o.user_id = ?
  order by bookId asc
  `;
  let values = [orderId, userId];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length === 0) throw new Error(ERROR_STRING.DataNotFound);
  return result as Book[];
};
