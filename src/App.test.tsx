import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Landing from "./Components/LandingPage";
import { calculateAverage } from "./Helpers/calculateAverage";

describe("Pizza Rate", () => {
  it("renders the landing page entry link", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /enter/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("calculates ratings without returning NaN for an empty list", () => {
    expect(calculateAverage([])).toBe(0);
    expect(calculateAverage([3, 4, 5])).toBe(4);
  });
});
