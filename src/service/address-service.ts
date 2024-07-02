import { Address, User } from '@prisma/client';
import {
	AddressResponse,
	CreateAddressRequest,
	GetAddressRequest,
	RemoveAddressRequest,
	UpdateAddressRequest,
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

	static async checkAddressMustExist(
		contactId: number,
		addressId: number
	): Promise<Address> {
		const address = await prismaClient.address.findFirst({
			where: {
				id: addressId,
				contactId: contactId,
			},
		});

		if (!address) {
			throw new ResponseError(404, 'Address not found');
		}

		return address;
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

		const address = await this.checkAddressMustExist(
			getRequest.contactId,
			getRequest.id
		);

		return toAddressResponse(address);
	}

	static async updateAddressContact(
		user: User,
		request: UpdateAddressRequest
	): Promise<AddressResponse> {
		// validation
		const updateRequest = Validation.validate(
			AddressValidation.UPDATE,
			request
		);

		// check contact must exist
		await ContactService.checkContactMustExist(
			user.username,
			request.contactId
		);

		// check address must exist
		await this.checkAddressMustExist(updateRequest.contactId, updateRequest.id);

		// update address
		const address = await prismaClient.address.update({
			where: {
				id: updateRequest.id,
				contactId: updateRequest.contactId,
			},
			data: updateRequest,
		});

		return toAddressResponse(address);
	}

	static async removeAddressContact(
		user: User,
		request: RemoveAddressRequest
	): Promise<AddressResponse> {
		// validation
		const removeRequest = Validation.validate(
			AddressValidation.REMOVE,
			request
		);

		// check contact must exist
		await ContactService.checkContactMustExist(
			user.username,
			request.contactId
		);

		// check address must be exist
		await this.checkAddressMustExist(removeRequest.contactId, removeRequest.id);

		const address = await prismaClient.address.delete({
			where: {
				id: removeRequest.id,
			},
		});

		return toAddressResponse(address);
	}
}
