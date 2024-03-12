import styled from "styled-components";
import { ColorKey, HeadingSize } from "../../styles/theme.style";

interface Props {
  children: React.ReactNode;
  size: HeadingSize;
  color?: ColorKey;
}

const Title = ({ children, size, color }: Props): JSX.Element => {
  return (
    <TitleStyle size={size} color={color}>
      {children}
    </TitleStyle>
  );
};

const TitleStyle = styled.h1<Omit<Props, "children">>`
  font-size: ${({ theme, size }) => theme.heading[size].fontSize};
  color: ${({ theme, color }) =>
    color ? theme.color[color] : theme.color.primary};
`;

export default Title;
