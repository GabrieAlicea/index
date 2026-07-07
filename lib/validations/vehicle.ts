import { z } from "zod";

export const VehicleSchema = z.object({
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  make: z.string().trim().min(1, "Make is required."),
  model: z.string().trim().min(1, "Model is required."),
  vin: z.string().trim().optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  engine: z.string().trim().optional(),
  licensePlate: z.string().trim().optional(),
  color: z.string().trim().optional(),
  transmission: z.string().trim().optional(),
  fuelType: z.string().trim().optional(),
});

export type VehicleInput = z.infer<typeof VehicleSchema>;
