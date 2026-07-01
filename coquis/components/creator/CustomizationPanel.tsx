"use client";

import { useBuilderStore } from "@/stores/builderStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Slider } from "@/components/ui/Slider";
import { ColorSwatchGrid } from "@/components/creator/ColorSwatchGrid";
import { SegmentedControl } from "@/components/creator/SegmentedControl";
import { AccessoryPicker } from "@/components/creator/AccessoryPicker";
import { RarityPicker } from "@/components/creator/RarityPicker";
import {
  BODY_COLOR_PALETTE,
  BELLY_COLOR_PALETTE,
  EYE_COLOR_PALETTE,
  TOE_COLOR_PALETTE,
} from "@/data/colorPalettes";
import type { BodyPattern, EyeStyle, Rarity } from "@/types/frog";

const PATTERN_OPTIONS: { value: BodyPattern; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "spots", label: "Spots" },
  { value: "stripes", label: "Stripes" },
];

const EYE_STYLE_OPTIONS: { value: EyeStyle; label: string }[] = [
  { value: "round", label: "Round" },
  { value: "sleepy", label: "Sleepy" },
  { value: "wide", label: "Wide" },
];

const RARITY_ARTICLE_LABEL: Record<Rarity, string> = {
  common: "",
  golden: "a golden",
  albino: "an albino",
};

export function CustomizationPanel() {
  const config = useBuilderStore((s) => s.config);
  const setField = useBuilderStore((s) => s.setField);

  return (
    <div className="w-full">
      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="eyes">Eyes</TabsTrigger>
          <TabsTrigger value="belly">Belly</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="rarity">Rare</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="space-y-5">
          {config.rarity !== "common" && (
            <p className="rounded-md bg-sungold-500/10 px-3 py-2 text-xs font-body text-charcoal-800/80 dark:text-mist-100/80">
              {`This coquí has ${RARITY_ARTICLE_LABEL[config.rarity]} rare skin, so its body color is set automatically. Pick "Common" under Rare Skins to customize colors again.`}
            </p>
          )}
          <ColorSwatchGrid
            label="Body color"
            options={BODY_COLOR_PALETTE}
            value={config.bodyColor}
            onChange={(value) => setField("bodyColor", value)}
          />
          <SegmentedControl
            label="Pattern"
            options={PATTERN_OPTIONS}
            value={config.pattern}
            onChange={(value) => setField("pattern", value)}
          />
        </TabsContent>

        <TabsContent value="eyes" className="space-y-5">
          <SegmentedControl
            label="Eye style"
            options={EYE_STYLE_OPTIONS}
            value={config.eyeStyle}
            onChange={(value) => setField("eyeStyle", value)}
          />
          <ColorSwatchGrid
            label="Eye color"
            options={EYE_COLOR_PALETTE}
            value={config.eyeColor}
            onChange={(value) => setField("eyeColor", value)}
          />
        </TabsContent>

        <TabsContent value="belly" className="space-y-5">
          {config.rarity !== "common" && (
            <p className="rounded-md bg-sungold-500/10 px-3 py-2 text-xs font-body text-charcoal-800/80 dark:text-mist-100/80">
              {`This coquí has ${RARITY_ARTICLE_LABEL[config.rarity]} rare skin, so its belly and toe colors are set automatically.`}
            </p>
          )}
          <ColorSwatchGrid
            label="Belly color"
            options={BELLY_COLOR_PALETTE}
            value={config.bellyColor}
            onChange={(value) => setField("bellyColor", value)}
          />
          <ColorSwatchGrid
            label="Toe color"
            options={TOE_COLOR_PALETTE}
            value={config.toeColor}
            onChange={(value) => setField("toeColor", value)}
          />
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoryPicker
            value={config.accessories}
            onChange={(ids) => setField("accessories", ids)}
          />
        </TabsContent>

        <TabsContent value="rarity">
          <RarityPicker
            value={config.rarity}
            onChange={(value) => setField("rarity", value)}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6 space-y-5 border-t border-stone-200 pt-5 dark:border-charcoal-800">
        <div>
          <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
            Size
          </p>
          <Slider
            label="Frog size"
            value={[config.size]}
            onValueChange={([value]) => value !== undefined && setField("size", value)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
            Smile
          </p>
          <Slider
            label="Frog smile"
            value={[config.smile]}
            onValueChange={([value]) => value !== undefined && setField("smile", value)}
            min={-1}
            max={1}
            step={0.1}
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Editing ${config.rarity !== "common" ? `${config.rarity} ` : ""}${config.pattern} coquí, size ${config.size}, ${config.accessories.length} accessories equipped.`}
      </p>
    </div>
  );
}
