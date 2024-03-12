import httpCode from "http-status-codes";
import request from "supertest";
import app from "../app";
import {
  selectBestBooks,
  selectBooksByParams,
} from "../databases/books.database";
import Database from "../db";
import { databaseConnector } from "../middlewares/common/databaseConnector.middleware";
import {
  ERROR_STRING,
  codeByError,
  messageByError,
} from "../middlewares/common/errorHandler.middleware";
import { issueToken } from "../middlewares/jsonwebtoken.middleware";
import { BookPagination } from "../models/book.model";
import { USER_ID } from "./CONSTANT";

let booksData: BookPagination;

const bookDetailData = [
  {
    id: 2,
    title: "책2",
    img: "2",
    category_id: 2,
    form: "전자책",
    isbn: "002",
    detail: "내용2",
    author: "작가2",
    pages: 200,
    summary: "요약2",
    contents: "목차2",
    price: 20000,
    likes: 0,
    publication_date: "2004-02-01",
    category_name: "테스트2",
    liked: 0,
  },
  {
    id: 2,
    title: "책2",
    img: "2",
    category_id: 2,
    form: "전자책",
    isbn: "002",
    detail: "내용2",
    author: "작가2",
    pages: 200,
    summary: "요약2",
    contents: "목차2",
    price: 20000,
    likes: 1,
    publication_date: "2004-02-01",
    category_name: "테스트2",
    liked: 1,
  },
];

const categoryData = [
  { id: 1, name: "테스트" },
  { id: 2, name: "테스트2" },
  { id: 3, name: "테스트3" },
];

let token: string;

beforeAll(async () => {
  Database.switchToTest();
  token = issueToken(USER_ID.CONSTANT_USER);
  booksData = await databaseConnector(selectBooksByParams)(
    undefined,
    1,
    8,
    false
  );
});

afterAll(async () => {
  Database.closePool();
});

describe("GET /books, 최신순, 한계 8", () => {
  test("전체", async () => {
    const response = await request(app).get("/books");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(booksData);
  });

  test("전체 = 카테고리 ID 0", async () => {
    const response = await request(app).get("/books?category_id=0");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(booksData);
  });

  test("카테고리 ID 2", async () => {
    const result = await databaseConnector(selectBooksByParams)(2, 1, 8, false);
    const response = await request(app).get("/books?category_id=2");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });

  test("카테고리 ID 1, 신간 False", async () => {
    const result = await databaseConnector(selectBooksByParams)(1, 1, 8, false);
    const response = await request(app).get("/books?category_id=1&news=false");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });

  test("카테고리 ID 2, 신간 True", async () => {
    const result = await databaseConnector(selectBooksByParams)(2, 1, 8, true);
    const response = await request(app).get("/books?category_id=2&news=true");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual({
      books: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
      },
    });
  });

  test("카테고리 ID 0, 신간 True", async () => {
    const result = await databaseConnector(selectBooksByParams)(
      undefined,
      1,
      8,
      true
    );
    const response = await request(app).get("/books?news=true");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });

  test("카테고리 ID 0, 페이지 2", async () => {
    const result = await databaseConnector(selectBooksByParams)(
      undefined,
      2,
      8,
      false
    );
    const response = await request(app).get("/books?currentPage=2");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });
});

describe("GET /books/categories", () => {
  test("도서 카테고리 전체 목록", async () => {
    const response = await request(app).get("/books/categories");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(categoryData);
  });
});

describe("GET /books/:bookId", () => {
  test("bookId 가 2인 책과 비 로그인 상태", async () => {
    const response = await request(app).get("/books/2");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(bookDetailData[0]);
  });

  test("bookId 가 2인 책과 해당 책에 좋아요를 한 유저", async () => {
    const response = await request(app)
      .get("/books/2")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(bookDetailData[1]);
  });

  test("유효하지 않은 bookId", async () => {
    const response = await request(app).get("/books/999");
    expect(response.status).toBe(codeByError[ERROR_STRING.DataNotFound]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.DataNotFound]);
  });

  test("bookId 가 아님", async () => {
    const response = await request(app).get("/books/blabla");
    expect(response.status).toBe(codeByError[ERROR_STRING.WrongRequest]);
    expect(response.text).toEqual(messageByError[ERROR_STRING.WrongRequest]);
  });
});

describe("GET /books/best", () => {
  test("5개 좋아요 내림차순 정렬", async () => {
    const result = await databaseConnector(selectBestBooks)();
    const response = await request(app).get("/books/best");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(result);
  });
});
