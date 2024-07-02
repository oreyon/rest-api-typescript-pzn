import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import { CreateAddressRequest } from '../model/address-model';
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
}
