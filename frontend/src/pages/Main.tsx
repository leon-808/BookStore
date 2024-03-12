import Title from "@f/components/common/Title";
import Banner from "@f/components/common/banner/Banner";
import MainBestBooks from "@f/components/common/main/MainBestBooks";
import MainNewBooks from "@f/components/common/main/MainNewBooks";
import MainReview from "@f/components/common/main/MainReview";
import { useMain } from "@f/hooks/useMain";
import { useMediaQuery } from "@f/hooks/useMediaQuery";
import styled from "styled-components";

const Main = (): JSX.Element => {
  const { reviews, newBooks, bestBooks, banners } = useMain();
  const { isMobile } = useMediaQuery();

  return (
    <MainStyle>
      <Banner banners={banners} />
      <section className="section">
        <Title size="large">베스트 셀러</Title>
        <MainBestBooks books={bestBooks} />
      </section>
      <section className="section">
        <Title size="large">신간 안내</Title>
        <MainNewBooks newBooks={newBooks} />
      </section>
      <section className="section">
        <Title size="large">리뷰</Title>
        <MainReview reviews={reviews} />
      </section>
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default Main;
