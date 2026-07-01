import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";
import { generateName } from "@/lib/frog/nameGenerator";
import { generatePersonality } from "@/lib/frog/personalityGenerator";
import { rollRarity, RARITY_PALETTES } from "@/lib/frog/rarity";
import { randomizeFrogConfig } from "@/lib/frog/randomize";
import { COQUI_NAMES } from "@/data/names";

describe("generateName", () => {
  it("always returns a name from the curated list", () => {
    for (let i = 0; i < 20; i++) {
      expect(COQUI_NAMES).toContain(generateName());
    }
  });
});

describe("generatePersonality", () => {
  it("returns all fields within their expected ranges", () => {
    for (let i = 0; i < 20; i++) {
      const p = generatePersonality();
      expect(p.trait.length).toBeGreaterThan(0);
      expect(p.favoriteFood.length).toBeGreaterThan(0);
      expect(p.favoriteWeather.length).toBeGreaterThan(0);
      expect(p.favoriteActivity.length).toBeGreaterThan(0);
      expect(p.favoritePlace.length).toBeGreaterThan(0);
      expect(p.favoriteTimeOfDay.length).toBeGreaterThan(0);
      expect(p.favoriteFlower.length).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(p.voicePitch);
      for (const meter of [p.energy, p.curiosity, p.friendliness, p.bravery]) {
        expect(meter).toBeGreaterThanOrEqual(0);
        expect(meter).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("rollRarity", () => {
  it("only ever returns a valid Rarity", () => {
    for (let i = 0; i < 200; i++) {
      expect(["common", "golden", "albino"]).toContain(rollRarity());
    }
  });

  it("is overwhelmingly common (roughly matches configured odds)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(rollRarity()).toBe("common");
    vi.spyOn(Math, "random").mockReturnValue(0.01);
    expect(rollRarity()).toBe("golden");
    vi.spyOn(Math, "random").mockReturnValue(0.08);
    expect(rollRarity()).toBe("albino");
    vi.restoreAllMocks();
  });
});

describe("randomizeFrogConfig", () => {
  it("produces a config with a valid rarity every time", () => {
    for (let i = 0; i < 20; i++) {
      const config = randomizeFrogConfig();
      expect(["common", "golden", "albino"]).toContain(config.rarity);
    }
  });
});

describe("FrogRenderer rare skin override", () => {
  it("overrides body/belly/toe colors for golden regardless of chosen colors", () => {
    const { container } = render(
      <FrogRenderer
        config={{ ...DEFAULT_FROG_CONFIG, rarity: "golden", bodyColor: "#000000" }}
      />
    );
    const bodyPath = container.querySelector("path[fill]");
    expect(bodyPath).toHaveAttribute("fill", RARITY_PALETTES.golden?.body);
  });

  it("leaves colors alone for common rarity", () => {
    const { container } = render(
      <FrogRenderer
        config={{ ...DEFAULT_FROG_CONFIG, rarity: "common", bodyColor: "#123456" }}
      />
    );
    const bodyPath = container.querySelector("path[fill]");
    expect(bodyPath).toHaveAttribute("fill", "#123456");
  });
});
