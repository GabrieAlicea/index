"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { CustomizationPanel } from "@/components/creator/CustomizationPanel";

export function CreatorControls() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-full max-w-md shrink-0 rounded-lg bg-cream-50 p-6 shadow-soft dark:bg-charcoal-800 lg:block">
        <CustomizationPanel />
      </aside>

      <div className="w-full lg:hidden">
        <Button onClick={() => setSheetOpen(true)} className="w-full">
          Customize your Coquí
        </Button>
        <BottomSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Customize your Coquí"
        >
          <CustomizationPanel />
        </BottomSheet>
      </div>
    </>
  );
}
