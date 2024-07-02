import { ZodType, z } from 'zod';

export class AddressValidation {
	static readonly CREATE: ZodType = z.object({
		contactId: z.number().positive(),
		street: z.string().min(1).max(255).optional(),
		city: z.string().min(1).max(255).optional(),
		province: z.string().min(1).max(255).optional(),
		country: z.string().min(1).max(255),
		postalCode: z.string().min(1).max(10),
	});
}
