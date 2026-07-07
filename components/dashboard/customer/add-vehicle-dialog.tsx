"use client";

import * as React from "react";
import { useActionState } from "react";
import { PlusCircle } from "lucide-react";

import { addVehicle, type VehicleFormState } from "@/app/dashboard/customer/vehicles/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: VehicleFormState = null;

function Field({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function AddVehicleDialog() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(addVehicle, initialState);
  const wasPending = React.useRef(false);

  React.useEffect(() => {
    if (wasPending.current && !pending && !state?.error && !state?.fieldErrors) {
      setOpen(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="size-4" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a vehicle</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <Field id="year" label="Year" type="number" placeholder="2021" required error={state?.fieldErrors?.year} />
            <div className="col-span-2 grid grid-cols-2 gap-3">
              <Field id="make" label="Make" placeholder="Toyota" required error={state?.fieldErrors?.make} />
              <Field id="model" label="Model" placeholder="RAV4" required error={state?.fieldErrors?.model} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="mileage" label="Mileage" type="number" placeholder="42000" error={state?.fieldErrors?.mileage} />
            <Field id="vin" label="VIN (optional)" placeholder="1FTFW1E5..." error={state?.fieldErrors?.vin} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="engine" label="Engine" placeholder="2.5L 4-Cyl" />
            <Field id="licensePlate" label="License Plate" placeholder="ABC1234" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field id="color" label="Color" placeholder="Silver" />
            <Field id="transmission" label="Transmission" placeholder="Automatic" />
            <Field id="fuelType" label="Fuel Type" placeholder="Gasoline" />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
