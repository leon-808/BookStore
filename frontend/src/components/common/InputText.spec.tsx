import { BookStoreThemeProvider } from "@f/context/themeContext";
import { render, screen } from "@testing-library/react";
import React from "react";
import InputText from "./InputText";

describe("InputText 컴포넌트 테스트", () => {
  const renderComponent = (ui: JSX.Element) =>
    render(<BookStoreThemeProvider>{ui}</BookStoreThemeProvider>);

  it("렌더 확인", () => {
    renderComponent(<InputText placeholder="여기에 입력하세요" />);
    expect(
      screen.getByPlaceholderText("여기에 입력하세요")
    ).toBeInTheDocument();
  });

  it("ForwardRef 확인", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderComponent(<InputText placeholder="여기에 입력하세요" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
