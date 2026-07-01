import { NameGeneratorField } from "@/components/creator/NameGeneratorField";
import { PersonalityCard } from "@/components/creator/PersonalityCard";

export function NamePersonalityPanel() {
  return (
    <div className="space-y-4">
      <NameGeneratorField />
      <PersonalityCard />
    </div>
  );
}
