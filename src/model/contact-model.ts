import { Contact } from '@prisma/client';

export type ContactResponse = {
	id: number;
	firstName: string;
	lastName?: string | null;
	email?: string | null;
	phone?: string | null;
};

export type CreateContactRequest = {
	firstName: string;
	lastName?: string;
	email?: string;
	phone?: string;
};

export function toContactResponse(contact: Contact): ContactResponse {
	return {
		id: contact.id,
		firstName: contact.firstName,
		lastName: contact.lastName,
		email: contact.email,
		phone: contact.phone,
	};
}
