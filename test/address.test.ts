import supertest from 'supertest';
import { AddressTest, ContactTest, UserTest } from './test-util';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';

describe('POST /api/v1/:contactId/addresses', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await AddressTest.deleteAll();
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should create be able to create address', async () => {
		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/${contact.id}/addresses`)
			.set('X-API-TOKEN', 'example')
			.send({
				street: 'example street',
				city: 'example city',
				province: 'example province',
				country: 'example country',
				postalCode: '12345',
			});

		logger.debug(response.body);
		expect(response.status).toBe(201);
		expect(response.body.code).toBe(201);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Address created');
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.street).toBe('example street');
		expect(response.body.data.city).toBe('example city');
		expect(response.body.data.province).toBe('example province');
		expect(response.body.data.country).toBe('example country');
		expect(response.body.data.postalCode).toBe('12345');
	});

	it('should be reject create new address if request is invalid', async () => {
		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/${contact.id}/addresses`)
			.set('X-API-TOKEN', 'example')
			.send({
				street: 'example street',
				city: 'example city',
				province: 'example province',
				country: '',
				postalCode: '',
			});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it('should be reject create new address if contact is not found', async () => {
		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/${contact.id + 1}/addresses`)
			.set('X-API-TOKEN', 'example')
			.send({
				street: 'example street',
				city: 'example city',
				province: 'example province',
				country: 'example country',
				postalCode: '12345',
			});

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
