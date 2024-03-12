import httpCode from "http-status-codes";
import { Connection, RowDataPacket } from "mysql2/promise";
import { transactionWrapper } from "../middlewares/common/transactionWrapper.middleware";

export const toggleLike = async (
  conn: Connection,
  bookId: number,
  userId: number
): Promise<number | void> => {
  let sql = "select * from likes where user_id = ? and book_id = ?";
  let values = [userId, bookId];
  const [result] = await conn.execute<RowDataPacket[]>(sql, values);

  const callback = async () => {
    let response = httpCode.CREATED;

    if (result.length === 0) {
      sql = "insert into likes values(?, ?)";
    } else {
      sql = "delete from likes where user_id = ? and book_id = ?";
      response = httpCode.OK;
    }

    await conn.execute(sql, values);

    return response;
  };

  return await transactionWrapper(conn, callback);
};
