import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styled from "styled-components";
import Button from "./Button";

interface Props {
  children: React.ReactNode;
  lineLimit: number;
}

const EllipsisBox = ({ children, lineLimit }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  return (
    <EllipsisBoxStyle lineLimit={lineLimit} expanded={expanded}>
      <div>{children}</div>
      <div className="toggle">
        <Button
          size="small"
          scheme="normal"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "접기" : "펼치기"} <FaAngleDown />
        </Button>
      </div>
    </EllipsisBoxStyle>
  );
};

interface EllipsisBoxStyleProps {
  lineLimit: number;
  expanded: boolean;
}

const EllipsisBoxStyle = styled.div<EllipsisBoxStyleProps>`
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({ lineLimit, expanded }) =>
      expanded ? "none" : lineLimit};
    -webkit-box-orient: vertical;
    padding: 20px 0 0 0;
    margin: 0;
  }

  .toggle {
    display: flex;
    justify-content: end;
    svg {
      transform: ${({ expanded }) =>
        expanded ? "rotate(180deg)" : "rotate(0)"};
    }
  }
`;

export default EllipsisBox;
