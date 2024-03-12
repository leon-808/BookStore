import { useEffect } from "react";
import { FaList, FaTh } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { QUERY_STRING } from "../../constants/queryString";
import Button from "../common/Button";

const viewOptions = [
  {
    value: "list",
    icon: <FaList />,
  },
  {
    value: "grid",
    icon: <FaTh />,
  },
];

export type ViewMode = "grid" | "list";

const BooksViewSwitcher = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSwitch = (value: ViewMode) => {
    searchParams.set(QUERY_STRING.VIEW, value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!searchParams.get(QUERY_STRING.VIEW)) handleSwitch("grid");
  }, []);

  return (
    <BooksViewSwitcherStyle>
      {viewOptions.map((option) => (
        <Button
          key={option.value}
          size="medium"
          scheme={
            searchParams.get(QUERY_STRING.VIEW) === option.value
              ? "primary"
              : "normal"
          }
          onClick={() => handleSwitch(option.value as ViewMode)}
        >
          {option.icon}
        </Button>
      ))}
    </BooksViewSwitcherStyle>
  );
};

const BooksViewSwitcherStyle = styled.div`
  display: flex;
  gap: 8px;
  svg {
    fill: #fff;
  }
`;

export default BooksViewSwitcher;
