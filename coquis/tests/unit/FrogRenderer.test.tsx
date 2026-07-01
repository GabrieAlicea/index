import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";

describe("FrogRenderer", () => {
  it("renders an accessible svg with all frog layers", () => {
    const { container } = render(<FrogRenderer config={DEFAULT_FROG_CONFIG} />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-label", "Your customized Coquí");

    // FrogBelly + 4x FrogToes = 5 ellipses
    expect(container.querySelectorAll("ellipse")).toHaveLength(5);
    // FrogBody outline + clipPath def path + mouth path = 3 paths
    expect(container.querySelectorAll("path")).toHaveLength(3);
    // FrogEyes: 2 sclera + 2 pupil circles
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("renders pattern overlays and accessories field without crashing", () => {
    const { container } = render(
      <FrogRenderer
        config={{
          ...DEFAULT_FROG_CONFIG,
          pattern: "spots",
          eyeStyle: "wide",
          accessories: ["tiny-hat"],
        }}
      />
    );

    // 5 spot circles + 4 eye circles + 1 tiny-hat pom circle
    expect(container.querySelectorAll("circle")).toHaveLength(10);
  });

  it("only renders equipped accessories", () => {
    const { container: none } = render(
      <FrogRenderer config={{ ...DEFAULT_FROG_CONFIG, accessories: [] }} />
    );
    const { container: two } = render(
      <FrogRenderer
        config={{
          ...DEFAULT_FROG_CONFIG,
          accessories: ["tiny-hat", "explorer-backpack"],
        }}
      />
    );

    // Neither accessory adds a <rect>; the backpack does (2 rects).
    expect(none.querySelectorAll("rect")).toHaveLength(0);
    expect(two.querySelectorAll("rect")).toHaveLength(2);
  });
});
