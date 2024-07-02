import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import { CreateContactRequest } from '../model/contact-model';
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
}
