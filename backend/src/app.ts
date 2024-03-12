import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();

const { NODE_ENV, PORT } = process.env;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

import { errorHandler } from "./middlewares/common/errorHandler.middleware";
import BannersRoute from "./routes/banners.route";
import BooksRoute from "./routes/books.route";
import CartsRoute from "./routes/carts.route";
import LikesRoute from "./routes/likes.route";
import OrdersRoute from "./routes/orders.route";
import ReviewsRoute from "./routes/reviews.route";
import UsersRoute from "./routes/users.route";

app.use("/books", BooksRoute);
app.use("/users", UsersRoute);
app.use("/likes", LikesRoute);
app.use("/carts", CartsRoute);
app.use("/orders", OrdersRoute);
app.use("/reviews", ReviewsRoute);
app.use("/banners", BannersRoute);

app.use(errorHandler);

if (NODE_ENV !== "test") {
  console.log(PORT, " is running");
  app.listen(PORT);
}

export default app;
