import { Contact, User } from '@prisma/client';
import {
	ContactResponse,
	CreateContactRequest,
	SearchContactRequest,
	UpdateContactRequest,
	toContactResponse,
} from '../model/contact-model';
import { ContactValidation } from '../validation/contact-validation';
import { Validation } from '../validation/validation';
import { prismaClient } from '../application/database';
import { logger } from '../application/logging';
import { ResponseError } from '../error/response-error';
import { Pageable } from '../model/page';

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

	static async checkContactMustExist(
		username: string,
		contactId: number
	): Promise<Contact> {
		const contact = await prismaClient.contact.findUnique({
			where: {
				id: contactId,
				username: username,
			},
		});

		if (!contact) {
			throw new ResponseError(404, 'Contact not found');
		}

		return contact;
	}

	static async getContactUser(
		user: User,
		id: number
	): Promise<ContactResponse> {
		const contact = await this.checkContactMustExist(user.username, id);
		return toContactResponse(contact);
	}

	static async updateContact(
		user: User,
		request: UpdateContactRequest
	): Promise<ContactResponse> {
		// validation process
		const updateRequest = Validation.validate(
			ContactValidation.UPDATE,
			request
		);

		await this.checkContactMustExist(user.username, request.id);

		const contact = await prismaClient.contact.update({
			where: {
				id: updateRequest.id,
				username: user.username,
			},
			data: updateRequest,
		});

		return toContactResponse(contact);
	}

	static async removeContact(user: User, id: number): Promise<ContactResponse> {
		await this.checkContactMustExist(user.username, id);

		const contact = await prismaClient.contact.delete({
			where: {
				id: id,
				username: user.username,
			},
		});

		return toContactResponse(contact);
	}

	static async searchContact(
		user: User,
		request: SearchContactRequest
	): Promise<Pageable<ContactResponse>> {
		const searchRequest = Validation.validate(
			ContactValidation.SEARCH,
			request
		);
		const skip = (searchRequest.page - 1) * searchRequest.size;

		const filters = [];
		// check if name is provided
		if (searchRequest.name) {
			filters.push({
				OR: [
					{
						firstName: {
							contains: searchRequest.name,
						},
					},
					{
						lastName: {
							contains: searchRequest.name,
						},
					},
				],
			});
		}
		// check if email is provided
		if (searchRequest.email) {
			filters.push({
				email: {
					contains: searchRequest.email,
				},
			});
		}

		// check if phone is provided
		if (searchRequest.phone) {
			filters.push({
				phone: {
					contains: searchRequest.phone,
				},
			});
		}

		const contacts = await prismaClient.contact.findMany({
			where: {
				username: user.username,
				AND: filters,
			},
			take: searchRequest.size,
			skip: skip,
		});

		const totalContacts = await prismaClient.contact.count({
			where: {
				username: user.username,
				AND: filters,
			},
		});

		return {
			data: contacts.map((contact) => toContactResponse(contact)),
			paging: {
				currentPage: searchRequest.page,
				totalPage: Math.ceil(totalContacts / searchRequest.size),
				size: searchRequest.size,
			},
		};
	}
}
