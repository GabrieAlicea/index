import { z } from "zod";

export const BookingAddressSchema = z.object({
  line1: z.string().trim().min(3, "Enter a street address."),
  city: z.string().trim().min(1, "Enter a city."),
  state: z.string().trim().min(2, "Enter a state."),
  postalCode: z.string().trim().min(5, "Enter a valid ZIP code."),
});

export const CreateBookingSchema = z.object({
  addressId: z.string().uuid().optional(),
  newAddress: BookingAddressSchema.optional(),
  vehicleId: z.string().uuid("Select a vehicle."),
  serviceIds: z.array(z.string().uuid()).min(1, "Select at least one service."),
  schedulingType: z.enum(["asap", "scheduled"]),
  scheduledAt: z.string().datetime().optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
