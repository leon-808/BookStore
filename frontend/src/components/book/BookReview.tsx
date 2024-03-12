import { decodeToken, getToken, useAuthStore } from "@f/store/authStore";
import styled from "styled-components";
import {
  BookReviewItemWrite,
  BookReviewItem as IBookReviewItem,
} from "../../../../backend/src/models/book.model";
import BookReviewAdd from "./BookReviewAdd";
import BookReviewItem from "./BookReviewItem";

interface Props {
  reviews: IBookReviewItem[];
  onAdd: (data: BookReviewItemWrite) => void;
}

const BookReview = ({ reviews, onAdd }: Props): JSX.Element => {
  const { isLoggedIn } = useAuthStore();
  const userId = isLoggedIn ? decodeToken(getToken() as string).id : null;

  const myReview = userId
    ? reviews.find((review) => review.userId === userId)
    : null;
  const otherReviews = userId
    ? reviews.filter((review) => review.userId !== userId)
    : reviews;
  const sortedReviews = myReview
    ? [myReview, ...otherReviews]
    : [...otherReviews];

  return (
    <BookReviewStyle>
      {reviews.filter((review) => review.userId === userId).length === 0 ? (
        <BookReviewAdd onAdd={onAdd} />
      ) : (
        <></>
      )}
      {sortedReviews.map((review) => (
        <BookReviewItem key={review.id} review={review} />
      ))}
    </BookReviewStyle>
  );
};

const BookReviewStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default BookReview;
