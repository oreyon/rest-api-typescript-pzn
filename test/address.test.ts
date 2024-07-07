import supertest from 'supertest';
import { AddressTest, ContactTest, UserTest } from './test-util';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';

describe('POST /api/v1/contacts/:contactId/addresses', () => {
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
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/contacts/${contact.id}/addresses`)
			.set('Cookie', cookies)
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
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/contacts/${contact.id}/addresses`)
			.set('Cookie', cookies)
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
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.post(`/api/v1/contacts/${contact.id + 1}/addresses`)
			.set('Cookie', cookies)
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

describe('GET /api/v1/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
		await AddressTest.create();
	});

	afterEach(async () => {
		await AddressTest.deleteAll();
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to get address', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Address retrieved successfully');
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.street).toBe(address.street);
		expect(response.body.data.city).toBe(address.city);
		expect(response.body.data.province).toBe(address.province);
		expect(response.body.data.country).toBe(address.country);
		expect(response.body.data.postalCode).toBe(address.postalCode);
	});

	it('should reject get address if address is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id}/addresses/${address.id + 1}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});

	it('should reject get address if contact is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id + 1}/addresses/${address.id}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe('PUT api/v1/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
		await AddressTest.create();
	});

	afterEach(async () => {
		await AddressTest.deleteAll();
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to update address', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set('Cookie', cookies)
			.send({
				street: 'example street',
				city: 'example city',
				province: 'example province',
				country: 'example country',
				postalCode: '12345',
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Address updated');
		expect(response.body.data.id).toBe(address.id);
		expect(response.body.data.street).toBe('example street');
		expect(response.body.data.city).toBe('example city');
		expect(response.body.data.province).toBe('example province');
		expect(response.body.data.country).toBe('example country');
		expect(response.body.data.postalCode).toBe('12345');
	});

	it('should reject update address if data is invalid', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set('Cookie', cookies)
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

	it('should reject update address if address is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id}/addresses/${address.id + 1}`)
			.set('Cookie', cookies)
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

	it('should reject update address if contact is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id + 1}/addresses/${address.id}`)
			.set('Cookie', cookies)
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

describe('DELETE /api/v1/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
		await AddressTest.create();
	});

	afterEach(async () => {
		await AddressTest.deleteAll();
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to remove address', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.delete(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Address deleted');
	});

	it('should reject remove address if address is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.delete(`/api/v1/contacts/${contact.id}/addresses/${address.id + 1}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});

	it('should breject remove address if contact is not found ', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const address = await AddressTest.get();

		const response = await supertest(app)
			.delete(`/api/v1/contacts/${contact.id + 1}/addresses/${address.id}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe('GET /api/v1/contacts/:contactId/addresses', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
		await AddressTest.create();
	});

	afterEach(async () => {
		await AddressTest.deleteAll();
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to list addresses', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();

		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id}/addresses`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('List address');
		expect(response.body.data.length).toBe(1);
	});

	it('should reject list address if contact is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();

		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id + 1}/addresses`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
