import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminPricingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Pricing Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Platform-wide commission and fee configuration. Per-service pricing is managed
          under Service Categories.
        </p>
      </div>

      <Card className="max-w-md p-6">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="commission">Platform commission (%)</Label>
            <Input id="commission" type="number" defaultValue={10} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cancellation-fee">Late cancellation fee (% of job total)</Label>
            <Input id="cancellation-fee" type="number" defaultValue={15} disabled />
          </div>
          <Button disabled className="self-start">
            Save Changes
          </Button>
          <p className="text-xs text-text-faint">
            Editable fee configuration ships alongside the admin CMS in Phase 5.
          </p>
        </div>
      </Card>
    </div>
  );
}
