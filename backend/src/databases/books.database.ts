import { Connection, RowDataPacket } from "mysql2/promise";
import { ERROR_STRING } from "../middlewares/common/errorHandler.middleware";
import { Book, BookDetail, BookPagination } from "../models/book.model";
import { Category } from "../models/category.model";
import { DBQueryParams } from "../types";

export const selectAllCategories = async (
  conn: Connection,
  ...params: DBQueryParams[]
): Promise<Category[]> => {
  const sql = "select * from category";
  const [result] = await conn.execute<RowDataPacket[]>(sql);
  if (result.length === 0) throw new Error(ERROR_STRING.DataNotFound);
  return result as Category[];
};

const sqlGenerator = (
  category_id: number | undefined,
  isNews: boolean | undefined
): string => {
  const conditions: string[] = [];

  if (category_id) conditions.push("category_id = ?");
  if (isNews)
    conditions.push("publication_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");

  return conditions.length > 1
    ? "where " + conditions.join(" and ")
    : conditions.length > 0
    ? "where " + conditions.join("")
    : "";
};

export const selectBooksByParams = async (
  conn: Connection,
  category_id: number | undefined,
  currentPage: number,
  limit: number,
  isNews: boolean
): Promise<BookPagination> => {
  const offset = limit * (currentPage - 1);

  let sql = `
  select b.*, count(l.book_id) as likes from book b
  left join likes l on b.id = l.book_id
  ${sqlGenerator(category_id, isNews)}
  group by b.id
  order by b.publication_date desc
  limit ? offset ?
  `;
  let values = [category_id, limit, offset].filter(
    (element) => element !== undefined
  );
  const [result] = await conn.query<RowDataPacket[]>(sql, values);

  return {
    books: result as Book[],
    pagination: {
      totalCount: result.length,
      currentPage: currentPage,
    },
  };
};

export const selectBookById = async (
  conn: Connection,
  bookId: number,
  userId: number
): Promise<BookDetail> => {
  let sql = `
  select b.*, count(l.book_id) as likes, c.name as category_name, if(any_value(l.user_id) is not null, true, false) as liked
  from book b
  join category c on c.id = b.category_id
  left join likes l on l.book_id = b.id and l.user_id = ?
  where b.id = ?
  group by b.id;
  `;
  let values = [userId ? userId : null, bookId];
  let [result] = await conn.execute<RowDataPacket[]>(sql, values);
  if (result.length === 0) throw new Error(ERROR_STRING.DataNotFound);
  return result[0] as BookDetail;
};

export const selectBestBooks = async (conn: Connection): Promise<Book[]> => {
  let sql = `
  select b.*, count(*) as likes 
  from book b
  join likes l on l.book_id = b.id
  group by b.id
  order by likes desc
  limit 5
  `;
  let [result] = await conn.execute<RowDataPacket[]>(sql);
  return result as Book[];
};
