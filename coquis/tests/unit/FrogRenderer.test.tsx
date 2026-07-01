import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";

describe("FrogRenderer", () => {
  it("renders as an accessible, tappable button wrapping a decorative svg", () => {
    const { container } = render(<FrogRenderer config={DEFAULT_FROG_CONFIG} />);

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Tap to hear your Coquí croak");

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");

    // FrogBelly + 4x FrogToes = 5 ellipses
    expect(container.querySelectorAll("ellipse")).toHaveLength(5);
    // FrogBody outline + clipPath def path + mouth path = 3 paths
    expect(container.querySelectorAll("path")).toHaveLength(3);
    // FrogEyes: 2 sclera + 2 pupil circles
    expect(container.querySelectorAll("circle")).toHaveLength(4);
    // FrogTongue is always in the DOM (hidden via scale/opacity when not flicking)
    expect(container.querySelectorAll("rect")).toHaveLength(1);
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

    // 1 tongue rect + 0 accessory rects
    expect(none.querySelectorAll("rect")).toHaveLength(1);
    // 1 tongue rect + 2 backpack rects
    expect(two.querySelectorAll("rect")).toHaveLength(3);
  });

  it("triggers a croak on click without throwing", async () => {
    const { getByRole } = render(<FrogRenderer config={DEFAULT_FROG_CONFIG} />);
    const button = getByRole("button", { name: "Tap to hear your Coquí croak" });
    button.click();
  });
});
