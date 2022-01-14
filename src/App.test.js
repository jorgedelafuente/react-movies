import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders search input on load", () => {
  render(<App />);
  const input = screen.queryByPlaceholderText(/Use Enter Key/i);
  expect(input).toBeInTheDocument();
});
