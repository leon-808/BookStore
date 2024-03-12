import httpCode from "http-status-codes";
import { Connection, RowDataPacket } from "mysql2/promise";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { transactionWrapper } from "../middlewares/common/transactionWrapper.middleware";
import { BookReviewItem } from "../models/book.model";

export const selectReviewByBook = async (
  conn: Connection,
  bookId: number
): Promise<BookReviewItem[]> => {
  let sql = `
  select r.id, r.user_id as userId, r.content, r.created_at, r.score, u.email
  from review r
  join user u on u.id = r.user_id
  where r.book_id = ?;
  `;
  let values = [bookId];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);
  return result as BookReviewItem[];
};

export const insertReviewOnBook = async (
  conn: Connection,
  bookId: number,
  userId: number,
  content: string,
  score: number
): Promise<number | void> => {
  let sql =
    "select count(*) as count from review where book_id = ? and user_id = ?";
  let values: (string | number)[] = [bookId, userId];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result[0].count !== 0) throw new Error(ERROR_STRING.DuplicateRequest);

  const callback = async () => {
    sql =
      "insert into review(book_id, user_id, content, score) values(?, ?, ?, ?)";
    values.push(content, score);
    await conn.execute(sql, values);
    return httpCode.CREATED;
  };

  return await transactionWrapper(conn, callback);
};

export const selectMainReview = async (
  conn: Connection
): Promise<BookReviewItem[]> => {
  let sql = `
  select r.id, r.user_id as userId, r.content, r.created_at, r.score, u.email
  from review r
  join user u on u.id = r.user_id
  order by created_at desc 
  limit 6;
  `;
  const [result] = await conn.execute(sql);
  return result as BookReviewItem[];
};
