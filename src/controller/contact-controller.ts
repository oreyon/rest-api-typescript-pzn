import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import {
	CreateContactRequest,
	SearchContactRequest,
	UpdateContactRequest,
} from '../model/contact-model';
import { ContactService } from '../service/contact-service';
import { logger } from '../application/logging';

export class ContactController {
	static async createContact(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: CreateContactRequest = req.body as CreateContactRequest;
			const response = await ContactService.createContact(req.user!, request);

			logger.debug('response : ' + JSON.stringify(response));
			res.status(201).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async getContactUser(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const contactId = Number(req.params.contactId);
			const response = await ContactService.getContactUser(
				req.user!,
				contactId
			);

			// debugging with logger
			// logger.debug('response : ' + JSON.stringify(response));
			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async updateContactUser(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: UpdateContactRequest = req.body as UpdateContactRequest;
			request.id = Number(req.params.contactId);
			const response = await ContactService.updateContact(req.user!, request);

			logger.debug('response : ' + JSON.stringify(response));
			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async removeContactUser(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const contactId = Number(req.params.contactId);
			const response = await ContactService.removeContact(req.user!, contactId);

			// logger.debug('response : ' + JSON.stringify(response));
			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'Contact deleted successfully',
			});
		} catch (e) {
			next(e);
		}
	}

	static async searchContactUser(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const request: SearchContactRequest = {
				name: req.query.name as string,
				email: req.query.email as string,
				phone: req.query.phone as string,
				page: req.query.page ? Number(req.query.page) : 1,
				size: req.query.size ? Number(req.query.size) : 10,
			};
			const response = await ContactService.searchContact(req.user!, request);

			// logger.debug('response : ' + JSON.stringify(response));
			res.status(200).json({
				code: 200,
				status: 'success',
				message: 'Search contact success',
				data: response.data,
				paging: response.paging,
			});
		} catch (e) {
			next(e);
		}
	}
}
