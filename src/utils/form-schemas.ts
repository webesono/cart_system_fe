import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  phoneNumber: z.string()
    .regex(/^[+]?[\d\s-]+$/, 'Nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;