import { z } from "zod";

export const reservationCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.number().int().min(1).max(50),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const reservationUpdateSchema = reservationCreateSchema.partial().extend({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
});

export type ReservationCreateInput = z.infer<typeof reservationCreateSchema>;
export type ReservationUpdateInput = z.infer<typeof reservationUpdateSchema>;

