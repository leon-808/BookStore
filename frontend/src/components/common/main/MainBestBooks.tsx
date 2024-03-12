import { Book } from "@b/models/book.model";
import BookBestItem from "@f/components/books/BookBestItem";
import styled from "styled-components";

interface Props {
  books: Book[];
}

const MainBestBooks = ({ books }: Props): JSX.Element => {
  return (
    <MainBestBooksStyle>
      {books.map((book, index) => (
        <BookBestItem key={book.id} book={book} itemIndex={index} />
      ))}
    </MainBestBooksStyle>
  );
};

const MainBestBooksStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  @media screen AND (${({ theme }) => theme.mediaQuery.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default MainBestBooks;
