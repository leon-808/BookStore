import { BookStoreThemeProvider } from "@f/context/themeContext";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button 컴포넌트 테스트", () => {
  const renderComponent = (ui: JSX.Element) =>
    render(<BookStoreThemeProvider>{ui}</BookStoreThemeProvider>);

  it("렌더 확인", () => {
    renderComponent(
      <Button size="large" scheme="primary">
        버튼
      </Button>
    );
    expect(screen.getByText("버튼")).toBeInTheDocument();
  });

  it("Size Props 적용", () => {
    renderComponent(
      <Button size="large" scheme="primary">
        버튼
      </Button>
    );
    expect(screen.getByRole("button")).toHaveStyle({
      fontSize: "1.5rem",
      padding: "1rem 2rem",
    });
  });

  it("Scheme Props 적용", () => {
    renderComponent(
      <Button size="large" scheme="primary">
        버튼
      </Button>
    );
    expect(screen.getByRole("button")).toHaveStyle({
      color: "white",
      backgroundColor: "midnightblue",
    });
  });
});
