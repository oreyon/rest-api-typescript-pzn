import { User } from '@prisma/client';
import {
	ContactResponse,
	CreateContactRequest,
	toContactResponse,
} from '../model/contact-model';
import { ContactValidation } from '../validation/contact-validation';
import { Validation } from '../validation/validation';
import { prismaClient } from '../application/database';
import { logger } from '../application/logging';

export class ContactService {
	static async createContact(
		user: User,
		request: CreateContactRequest
	): Promise<ContactResponse> {
		const createRequest = Validation.validate(
			ContactValidation.CREATE,
			request
		);

		// CreateContactRequest is not assignable to parameter of type 'ContactCreateInput'
		// because CreateContactRequest have no username field
		// if we want to insert to database, username must be provided
		// username is available in user: User object
		// so we need create new object to combine user.username and createRequest

		const record = {
			...createRequest,
			...{ username: user.username },
		};

		const contact = await prismaClient.contact.create({
			data: record,
		});

		// debugging with logger
		// logger.debug(contact);
		return toContactResponse(contact);
	}
}
