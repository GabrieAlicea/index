import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Platform-wide configuration.</p>
      </div>

      <Card className="max-w-lg p-6">
        <h2 className="font-semibold text-text">Service Areas</h2>
        <div className="mt-4 flex flex-col gap-3">
          {["Orlando, FL", "Tampa, FL", "Miami, FL"].map((city) => (
            <div key={city} className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{city}</span>
              <Switch defaultChecked disabled />
            </div>
          ))}
        </div>
      </Card>

      <Card className="max-w-lg p-6">
        <h2 className="font-semibold text-text">Notification Sender Addresses</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="support-email">Support email</Label>
            <Input id="support-email" defaultValue="support@revvy.com" disabled />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="from-sms">SMS sender name</Label>
            <Input id="from-sms" defaultValue="Revvy" disabled />
          </div>
        </div>
      </Card>
    </div>
  );
}
