import BookReview from "@f/components/book/BookReview";
import Modal from "@f/components/common/Modal";
import { Tab, Tabs } from "@f/components/common/Tabs";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { BookDetail as IBookDetail } from "../../../backend/src/models/book.model";
import AddToCart from "../components/book/AddToCart";
import LikeButton from "../components/book/LikeButton";
import EllipsisBox from "../components/common/EllipsisBox";
import Title from "../components/common/Title";
import { useBook } from "../hooks/useBook";
import { formatDate, formatNumber } from "../utils/format";
import { getImgSrc } from "../utils/image";

const bookInfoList = [
  {
    label: "카테고리",
    key: "category_name",
    filter: (book: IBookDetail) => (
      <Link to={`/books?category_id=${book.category_id}`}>
        {book.category_name}
      </Link>
    ),
  },
  {
    label: "포맷",
    key: "form",
  },
  {
    label: "ISBN",
    key: "isbn",
  },
  {
    label: "출간일",
    key: "publication_date",
    filter: (book: IBookDetail) => {
      if (book.publication_date) return `${formatDate(book.publication_date)}`;
      return;
    },
  },
  {
    label: "가격",
    key: "price",
    filter: (book: IBookDetail) => {
      if (book.price) return `${formatNumber(book.price)}원`;
      return;
    },
  },
];

const BookDetail = (): JSX.Element => {
  const { bookId } = useParams();
  const { book, likeToggle, reviews, addReview } = useBook(bookId);
  const [isImgOpen, setIsImgOpen] = useState(false);

  if (!book) return <></>;

  return (
    <BookDetailStyle>
      <header className="header">
        <div className="img" onClick={() => setIsImgOpen(true)}>
          <img src={getImgSrc(book.img)} alt={book.title} />
        </div>
        <Modal isOpen={isImgOpen} onClose={() => setIsImgOpen(false)}>
          <img src={getImgSrc(book.img)} alt={book.title} />
        </Modal>
        <div className="info">
          <Title size="large" color="text">
            {book.title}
          </Title>
          {bookInfoList.map((item) => (
            <dl key={item.key}>
              <dt>{item.label}</dt>
              <dd>
                {item.filter
                  ? item.filter(book)
                  : book[item.key as keyof IBookDetail]}
              </dd>
            </dl>
          ))}
          <p className="summary">{book.summary}</p>
          <div className="like">
            <LikeButton book={book} onClick={likeToggle} />
          </div>
          <div className="add-cart">
            <AddToCart book={book} />
          </div>
        </div>
      </header>
      <div className="content">
        <Tabs>
          <Tab title="상세 설명">
            <EllipsisBox lineLimit={4}>
              <p className="detail">{book.detail}</p>
            </EllipsisBox>
          </Tab>
          <Tab title="목차">
            <p className="detail">{book.contents}</p>
          </Tab>
          <Tab title="리뷰">
            <BookReview reviews={reviews} onAdd={addReview} />
          </Tab>
        </Tabs>
      </div>
    </BookDetailStyle>
  );
};

const BookDetailStyle = styled.div`
  .header {
    display: flex;
    align-items: start;
    gap: 24px;
    padding: 0 0 24px 0;

    .img {
      flex: 1;
      img {
        width: 100%;
        height: auto;
      }
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;

      dl {
        display: flex;
        margin: 0;
        dt {
          width: 80px;
          color: ${({ theme }) => theme.color.secondary};
        }
        a {
          color: ${({ theme }) => theme.color.primary};
        }
      }
    }
  }
`;

export default BookDetail;
