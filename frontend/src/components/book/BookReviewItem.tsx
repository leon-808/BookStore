import { formatDate } from "@f/utils/format";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import { BookReviewItem as IBookReviewItem } from "../../../../backend/src/models/book.model";

interface Props {
  review: IBookReviewItem;
}

const Stars = (props: Pick<IBookReviewItem, "score">): JSX.Element => {
  return (
    <span className="star">
      {Array.from({ length: props.score }, (_, index) => (
        <FaStar key={`score${index}`} />
      ))}
    </span>
  );
};

const BookReviewItem = ({ review }: Props): JSX.Element => {
  return (
    <BookReviewItemStyle>
      <header className="header">
        <div>
          <span>{review.userId}</span>
          <Stars score={review.score}></Stars>
        </div>
        <div>{formatDate(review.created_at)}</div>
      </header>
      <div className="content">
        <p>{review.content}</p>
      </div>
    </BookReviewItemStyle>
  );
};

const BookReviewItemStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.default};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.secondary};
    padding: 0;
  }

  .content {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
  }

  .star {
    padding: 0 0 0 8px;
    svg {
      fill: ${({ theme }) => theme.color.primary};
    }
  }
`;

export default BookReviewItem;
