import styled from "styled-components";
import logo from "../../assets/images/logo.png";

const Footer = (): JSX.Element => {
  return (
    <FooterStyle>
      <h1 className="logo">
        <img src={logo} alt="book store" />
      </h1>
      <div className="copyright">
        <p>Copyright(c), 2024, Book Store.</p>
      </div>
    </FooterStyle>
  );
};

const FooterStyle = styled.footer`
  width: 100%;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.width.large};
  border-top: 1px solid ${({ theme }) => theme.color.background};
  padding: 20px 0;
  display: flex;
  justify-content: space-between;

  .logo {
    img {
      width: 140px;
    }
  }

  .copyright {
    p {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.color.text};
    }
  }

  @media screen AND (${({ theme }) => theme.mediaQuery.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

export default Footer;
