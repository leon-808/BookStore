import "dotenv/config";
import mysql2, { Pool } from "mysql2/promise";

class Database {
  static #pool: Pool;
  static isTest: boolean = false;

  constructor() {
    const {
      HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_DATABASE,
      DB_DATABASE_TEST,
      DB_CONNECTION_LIMIT,
    } = process.env;

    if (
      !HOST ||
      !DB_PORT ||
      !DB_USER ||
      !DB_PASSWORD ||
      !DB_DATABASE ||
      !DB_DATABASE_TEST ||
      !DB_CONNECTION_LIMIT
    ) {
      throw new Error("환경 변수 매칭 안 됨");
    }

    if (Database.isTest) {
      process.env.DB_DATABASE = "book_store_test";
    }

    Database.#pool = mysql2.createPool({
      host: HOST,
      port: parseInt(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: Database.isTest ? DB_DATABASE_TEST : DB_DATABASE,
      connectionLimit: parseInt(DB_CONNECTION_LIMIT),
      dateStrings: true,
    });
  }

  static async getConnection() {
    if (!Database.#pool) {
      new Database();
    }
    return await Database.#pool.getConnection();
  }

  static async closePool() {
    if (Database.#pool) {
      await Database.#pool.end();
    }
  }

  static switchToTest() {
    if (Database.isTest === false) Database.isTest = true;
  }
}

export default Database;
