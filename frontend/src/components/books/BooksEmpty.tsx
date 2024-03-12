import { FaSmileWink } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Empty from "../common/Empty";

const BooksEmpty = (): JSX.Element => {
  return (
    <Empty
      icon={<FaSmileWink />}
      title="검색 결과가 없습니다"
      description={<Link to="/books">전체 검색 결과로 이동</Link>}
    ></Empty>
  );
};

const BooksEmptyStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 120px 0;

  .icon {
    svg {
      font-size: 4rem;
      fill: #ccc;
    }
  }
`;

export default BooksEmpty;
