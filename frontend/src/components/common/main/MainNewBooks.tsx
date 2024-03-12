import { Book } from "@b/models/book.model";
import BookItem from "@f/components/books/BookItem";
import styled from "styled-components";

interface Props {
  newBooks: Book[];
}

const MainNewBooks = ({ newBooks }: Props): JSX.Element => {
  return (
    <MainNewBooksStyle>
      {newBooks.map((book) => (
        <BookItem key={book.id} book={book} view="grid" />
      ))}
    </MainNewBooksStyle>
  );
};

const MainNewBooksStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media screen AND (${({ theme }) => theme.mediaQuery.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default MainNewBooks;
