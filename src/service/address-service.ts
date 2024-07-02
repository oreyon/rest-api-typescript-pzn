import { User } from '@prisma/client';
import {
	AddressResponse,
	CreateAddressRequest,
	toAddressResponse,
} from '../model/address-model';
import { Validation } from '../validation/validation';
import { AddressValidation } from '../validation/address-validation';
import { ContactService } from './contact-service';
import { prismaClient } from '../application/database';

export class AddressService {
	static async createAddressContact(
		user: User,
		request: CreateAddressRequest
	): Promise<AddressResponse> {
		// validation
		const createRequest = Validation.validate(
			AddressValidation.CREATE,
			request
		);

		// check contact must exist

		await ContactService.checkContactMustExist(
			user.username,
			request.contactId
		);

		// create address
		const address = await prismaClient.address.create({
			data: createRequest,
		});

		return toAddressResponse(address);
	}
}
