import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import styled from "styled-components";

interface Props {
  isChecked: boolean;
  onCheck: () => void;
}

const CheckIconButton = ({ isChecked, onCheck }: Props): JSX.Element => {
  return (
    <CheckIconButtonStyle onClick={onCheck}>
      <div>{isChecked ? <FaRegCheckCircle /> : <FaRegCircle />}</div>
    </CheckIconButtonStyle>
  );
};

const CheckIconButtonStyle = styled.div`
  background: none;
  border: 0;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export default CheckIconButton;
