import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { UserController } from '../controller/user-controller';
import { ContactController } from '../controller/contact-controller';
import { AddressController } from '../controller/address-controller';

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// user api
apiRouter.get('/api/v1/users/current', UserController.getCurrentUser);
apiRouter.patch('/api/v1/users/current', UserController.updateUser);
apiRouter.delete('/api/v1/users/current', UserController.logout);

// contact api
apiRouter.post('/api/v1/contacts', ContactController.createContact);
// \\d+ is a regular expression to match only numbers
apiRouter.get(
	'/api/v1/contacts/:contactId(\\d+)',
	ContactController.getContactUser
);
apiRouter.put(
	'/api/v1/contacts/:contactId(\\d+)',
	ContactController.updateContactUser
);

apiRouter.delete(
	'/api/v1/contacts/:contactId(\\d+)',
	ContactController.removeContactUser
);

apiRouter.get('/api/v1/contacts', ContactController.searchContactUser);

// address api
apiRouter.post(
	'/api/v1/contacts/:contactId(\\d+)/addresses',
	AddressController.createAddressContact
);

apiRouter.get(
	'/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)',
	AddressController.getAddressContact
);

apiRouter.put(
	'/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)',
	AddressController.updateAddressContact
);

apiRouter.delete(
	'/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)',
	AddressController.removeAddressContact
);

apiRouter.get(
	'/api/v1/contacts/:contactId(\\d+)/addresses',
	AddressController.listAddressContact
);
