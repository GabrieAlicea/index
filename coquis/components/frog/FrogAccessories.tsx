import { ACCESSORY_CATALOG } from "@/data/accessories";

export interface FrogAccessoriesProps {
  accessories: string[];
}

export function FrogAccessories({ accessories }: FrogAccessoriesProps) {
  const equipped = ACCESSORY_CATALOG.filter((item) => accessories.includes(item.id));

  return (
    <g>
      {equipped.map((item) => (
        <g key={item.id} transform={item.frogTransform}>
          <item.Icon />
        </g>
      ))}
    </g>
  );
}
