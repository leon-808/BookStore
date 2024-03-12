import httpCode from "http-status-codes";
import request from "supertest";
import app from "../app";
import Database from "../db";

const bannersData = [
  {
    id: 1,
    title: "책1",
    description: "요약1",
    image: "1",
    url: "https://picsum.photos/id/1/1200/400",
    target: "_blank",
  },
  {
    id: 2,
    title: "책2",
    description: "요약2",
    image: "2",
    url: "https://picsum.photos/id/2/1200/400",
    target: "_blank",
  },
  {
    id: 3,
    title: "책3",
    description: "요약3",
    image: "3",
    url: "https://picsum.photos/id/3/1200/400",
    target: "_blank",
  },
];

beforeAll(async () => {
  Database.switchToTest();
});

afterAll(async () => {
  Database.closePool();
});

describe("GET /", () => {
  test("배너 전부", async () => {
    const response = await request(app).get("/banners");
    expect(response.status).toBe(httpCode.OK);
    expect(response.body).toEqual(bannersData);
  });
});
