import { Book } from "@b/models/book.model";
import { BookStoreThemeProvider } from "@f/context/themeContext";
import { formatNumber } from "@f/utils/format";
import { render, screen } from "@testing-library/react";
import BookItem from "./BookItem";

const dummyBook: Book = {
  id: 1,
  title: "Dummy Book",
  img: 5,
  category_id: 1,
  form: "paperback",
  isbn: "Dummy ISBN",
  detail: "Dummy Detail",
  author: "Dummy Author",
  pages: 100,
  summary: "Dummy Summary",
  contents: "Dummy Contents",
  price: 10000,
  likes: 1,
  publication_date: "2024-02-01",
};

describe("BookItem 컴포넌트 테스트", () => {
  it("렌더 확인", () => {
    render(
      <BookStoreThemeProvider>
        <BookItem book={dummyBook} />
      </BookStoreThemeProvider>
    );
    expect(screen.getByText(dummyBook.title)).toBeInTheDocument();
    expect(screen.getByText(dummyBook.summary)).toBeInTheDocument();
    expect(screen.getByText(dummyBook.author)).toBeInTheDocument();
    expect(
      screen.getByText(formatNumber(dummyBook.price) + "원")
    ).toBeInTheDocument();
    expect(screen.getByAltText(dummyBook.title)).toHaveAttribute(
      "src",
      `http://picsum.photos/id/${dummyBook.img}/600/600`
    );
  });
});
