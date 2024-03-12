import { render, screen } from "@testing-library/react";
import { BookStoreThemeProvider } from "../../context/themeContext";
import Title from "./Title";

describe("Title 컴포넌트 테스트", () => {
    const renderComponent = (ui: JSX.Element) => render(
        <BookStoreThemeProvider>{ui}</BookStoreThemeProvider>
    );

    it("렌더 확인", () => {
        renderComponent(<Title size="large">제목</Title>);
        expect(screen.getByText("제목")).toBeInTheDocument();
    })

    it("Size Props 적용", () => {
        renderComponent(<Title size="large">제목</Title>);
        expect(screen.getByText("제목")).toHaveStyle({ fontSize: "2rem"});
    })

    it("Color Props 적용", () => {
        renderComponent(<Title size="large">제목</Title>);
        expect(screen.getByText("제목")).toHaveStyle({ color: "brown"});
    })
})