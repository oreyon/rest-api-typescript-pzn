import { z, ZodType } from 'zod';

export class ContactValidation {
	static readonly CREATE: ZodType = z.object({
		firstName: z.string().min(1).max(100),
		lastName: z.string().min(1).max(100).optional(),
		email: z.string().min(1).max(100).email().optional(),
		phone: z.string().min(1).max(20).optional(),
	});

	static readonly UPDATE: ZodType = z.object({
		id: z.number().positive(),
		firstName: z.string().min(1).max(100),
		lastName: z.string().min(1).max(100).optional(),
		email: z.string().min(1).max(100).email().optional(),
		phone: z.string().min(1).max(20).optional(),
	});

	static readonly SEARCH: ZodType = z.object({
		name: z.string().min(1).optional(),
		email: z.string().min(1).email().optional(),
		phone: z.string().min(1).optional(),
		page: z.number().min(1).positive(),
		size: z.number().min(1).max(100).positive(),
	});
}
