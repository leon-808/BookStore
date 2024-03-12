import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { QUERY_STRING } from "../../constants/queryString";
import { useCategory } from "../../hooks/useCategory";
import Button from "../common/Button";

const BooksFilter = (): JSX.Element => {
  const { category } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategory = (id: number | null) => {
    if (id) searchParams.set(QUERY_STRING.CATEGORY_ID, id.toString());
    else searchParams.delete(QUERY_STRING.CATEGORY_ID);
    setSearchParams(searchParams);
  };

  const handleNewBooks = () => {
    if (searchParams.get(QUERY_STRING.NEWS))
      searchParams.delete(QUERY_STRING.NEWS);
    else searchParams.set(QUERY_STRING.NEWS, "true");
    setSearchParams(searchParams);
  };

  return (
    <BooksFilterStyle>
      <div className="category">
        {category.map((item) => (
          <Button
            size="medium"
            scheme={item.isActive ? "primary" : "normal"}
            key={item.id}
            onClick={() => handleCategory(item.id)}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="new">
        <Button
          size="medium"
          scheme={searchParams.get(QUERY_STRING.NEWS) ? "primary" : "normal"}
          onClick={() => handleNewBooks()}
        >
          신간
        </Button>
      </div>
    </BooksFilterStyle>
  );
};

const BooksFilterStyle = styled.div`
  display: flex;
  gap: 24px;

  .category {
    display: flex;
    gap: 8px;
  }
`;

export default BooksFilter;
