import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import {
	CreateAddressRequest,
	GetAddressRequest,
	RemoveAddressRequest,
	UpdateAddressRequest,
} from '../model/address-model';
import { AddressService } from '../service/address-service';

export class AddressController {
	static async createAddressContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: CreateAddressRequest = req.body as CreateAddressRequest;
			request.contactId = Number(req.params.contactId);

			const response = await AddressService.createAddressContact(
				req.user!,
				request
			);

			res.status(201).json({
				code: 201,
				status: 'success',
				message: 'Address created',
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async getAddressContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: GetAddressRequest = {
				id: Number(req.params.addressId),
				contactId: Number(req.params.contactId),
			};

			const response = await AddressService.getAddressContact(
				req.user!,
				request
			);

			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'Address retrieved successfully',
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async updateAddressContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
			request.contactId = Number(req.params.contactId);
			request.id = Number(req.params.addressId);

			const response = await AddressService.updateAddressContact(
				req.user!,
				request
			);

			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'Address updated',
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async removeAddressContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: RemoveAddressRequest = {
				id: Number(req.params.addressId),
				contactId: Number(req.params.contactId),
			};

			await AddressService.removeAddressContact(req.user!, request);

			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'Address deleted',
			});
		} catch (e) {
			next(e);
		}
	}

	static async listAddressContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const contactId = Number(req.params.contactId);

			const response = await AddressService.listAddressContact(
				req.user!,
				contactId
			);

			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'List address',
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}
}
