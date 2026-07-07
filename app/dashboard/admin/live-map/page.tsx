import { MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function LiveMapPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Live Jobs Map</h1>
        <p className="mt-1 text-sm text-text-muted">Every active job and online mechanic, in real time.</p>
      </div>
      <Card className="flex min-h-[480px] items-center justify-center bg-surface">
        <div className="text-center text-text-faint">
          <MapPin className="mx-auto size-8" />
          <p className="mt-2 text-sm">The live map renders once jobs and mechanics are active.</p>
        </div>
      </Card>
    </div>
  );
}
