import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Expired from "../app/expired/page";

describe("Expired", () => {
  it("renders a heading", () => {
    render(<Expired />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
