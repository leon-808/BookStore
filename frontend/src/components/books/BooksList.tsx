import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Book } from "../../../../backend/src/models/book.model";
import { QUERY_STRING } from "../../constants/queryString";
import BookItem from "./BookItem";
import { ViewMode } from "./BooksViewSwitcher";

interface Props {
  books: Book[];
}

const BooksList = ({ books }: Props): JSX.Element => {
  const location = useLocation();
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get(QUERY_STRING.VIEW)) {
      setView(params.get(QUERY_STRING.VIEW) as ViewMode);
    }
  }, [location.search]);

  return (
    <BooksListStyle view={view}>
      {books?.map((item) => (
        <BookItem key={item.id} book={item} view={view} />
      ))}
    </BooksListStyle>
  );
};

interface BookListStyleProps {
  view: ViewMode;
}

const BooksListStyle = styled.div<BookListStyleProps>`
  display: grid;
  grid-template-columns: ${({ view }) =>
    view === "grid" ? "repeat(4, 1fr)" : "repeat(1, 1fr)"};
  gap: 24px;
`;

export default BooksList;
