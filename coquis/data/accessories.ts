import type { ComponentType } from "react";
import { TinyHat } from "@/assets/svg/frog-parts/accessories/TinyHat";
import { FlowerAccessory } from "@/assets/svg/frog-parts/accessories/FlowerAccessory";
import { FlagBandana } from "@/assets/svg/frog-parts/accessories/FlagBandana";
import { ExplorerBackpack } from "@/assets/svg/frog-parts/accessories/ExplorerBackpack";
import { LeafAccent } from "@/assets/svg/frog-parts/accessories/LeafAccent";

export interface AccessoryDefinition {
  id: string;
  label: string;
  Icon: ComponentType;
  /** viewBox for the standalone picker icon — each accessory is authored around local origin (0,0). */
  iconViewBox: string;
  /** SVG transform positioning the accessory within the frog's 200x220 viewBox. */
  frogTransform: string;
}

export const ACCESSORY_CATALOG: AccessoryDefinition[] = [
  {
    id: "tiny-hat",
    label: "Tiny Hat",
    Icon: TinyHat,
    iconViewBox: "-24 -24 48 48",
    frogTransform: "translate(100,24)",
  },
  {
    id: "flower",
    label: "Flower",
    Icon: FlowerAccessory,
    iconViewBox: "-16 -16 32 32",
    frogTransform: "translate(56,68)",
  },
  {
    id: "pr-flag-bandana",
    label: "PR Flag Bandana",
    Icon: FlagBandana,
    iconViewBox: "-28 -14 56 28",
    frogTransform: "translate(100,148)",
  },
  {
    id: "explorer-backpack",
    label: "Explorer Backpack",
    Icon: ExplorerBackpack,
    iconViewBox: "-18 -20 36 40",
    frogTransform: "translate(150,120)",
  },
  {
    id: "leaf-accent",
    label: "Leaf",
    Icon: LeafAccent,
    iconViewBox: "-14 -20 28 40",
    frogTransform: "translate(46,196) rotate(-20)",
  },
];
