import { Connection, RowDataPacket } from "mysql2/promise";
import { Banner } from "../models/banner.model";

export const selectBanners = async (conn: Connection): Promise<Banner[]> => {
  let sql = `
  select b.id, b.title, b.summary as description, b.img as image, 
  concat('https://picsum.photos/id/',b.id,'/1200/400') as url, '_blank' as target
  from banner ba
  join book b on b.id = ba.book_id;
  `;
  const [result] = await conn.execute<RowDataPacket[]>(sql);
  return result as Banner[];
};
