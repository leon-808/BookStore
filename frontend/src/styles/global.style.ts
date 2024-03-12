import { createGlobalStyle } from "styled-components";
import "sanitize.css";
import { ThemeName } from "./theme.style";

interface Props {
    themeName: ThemeName;
}

export const GlobalStyle = createGlobalStyle<Props>`
    body {
        padding: 0;
        margin: 0;
        background-color: ${(props) => (props.themeName === "light" ? "white" : "black")};
    }

    h1 {
        margin: 0;
    }
`;