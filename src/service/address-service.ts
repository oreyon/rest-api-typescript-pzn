import { User } from '@prisma/client';
import {
	AddressResponse,
	CreateAddressRequest,
	GetAddressRequest,
	toAddressResponse,
} from '../model/address-model';
import { Validation } from '../validation/validation';
import { AddressValidation } from '../validation/address-validation';
import { ContactService } from './contact-service';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

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

	static async getAddressContact(
		user: User,
		request: GetAddressRequest
	): Promise<AddressResponse> {
		// validation
		const getRequest = Validation.validate(AddressValidation.GET, request);

		// check contact must exist
		await ContactService.checkContactMustExist(
			user.username,
			request.contactId
		);

		const address = await prismaClient.address.findFirst({
			where: {
				id: getRequest.id,
				contactId: getRequest.contactId,
			},
		});

		if (!address) {
			throw new ResponseError(404, 'Address not found');
		}

		return toAddressResponse(address);
	}
}
