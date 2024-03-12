import Database from "../../db";
import { DBQueryParams } from "../../types";

export const databaseConnector =
  (handler: Function) =>
  async (...params: DBQueryParams[]) => {
    let conn;
    try {
      conn = await Database.getConnection();
      return await handler(conn, ...params);
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  };
