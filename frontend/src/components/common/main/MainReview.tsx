import { BookReviewItem as IBookReviewItem } from "@b/models/book.model";
import BookReviewItem from "@f/components/book/BookReviewItem";
import Slider from "react-slick";
import styled from "styled-components";

import { useMediaQuery } from "@f/hooks/useMediaQuery";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Props {
  reviews: IBookReviewItem[];
}

const MainReview = ({ reviews }: Props): JSX.Element => {
  const { isMobile } = useMediaQuery();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: isMobile ? 1 : 3,
    gap: 16,
  };

  return (
    <MainReviewStyle>
      <Slider {...sliderSettings}>
        {reviews.map((review) => (
          <BookReviewItem key={review.id} review={review} />
        ))}
      </Slider>
    </MainReviewStyle>
  );
};

const MainReviewStyle = styled.div`
  padding: 0 0 24px 0;

  .slick-track {
    padding: 12px 0;
  }

  .slick-slide > div {
    margin: 0 12px;
  }

  .slick-prev:before,
  .slick-next:before {
    color: #000;
  }

  @media screen AND (${({ theme }) => theme.mediaQuery.mobile}) {
    .slick-prev {
      left: 0;
      z-index: 1000;
    }
    .slick-next {
      right: 0;
    }
  }
`;

export default MainReview;
