import { Book } from "@b/models/book.model";
import styled from "styled-components";
import BookItem, { BookItemStyle } from "./BookItem";

interface Props {
  book: Book;
  itemIndex: number;
}

const BookBestItem = ({ book, itemIndex }: Props): JSX.Element => {
  return (
    <BookBestItemStyle>
      <div className="rank">{itemIndex + 1}</div>
      <BookItem book={book} view="grid" />
    </BookBestItemStyle>
  );
};

const BookBestItemStyle = styled.div`
  ${BookItemStyle} {
    height: 100%;

    .summary,
    .price,
    .likes {
      display: none;
    }

    h2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  position: relative;
  .rank {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 40px;
    height: 40px;
    background-color: ${({ theme }) => theme.color.primary};
    border-radius: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #fff;
    font-weight: 700;
    font-style: italic;
  }
`;

export default BookBestItem;
