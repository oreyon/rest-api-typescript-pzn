import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { ContactTest, UserTest } from './test-util';

describe('POST /api/v1/contacts', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should create new contact', async () => {
		const response = await supertest(app)
			.post('/api/v1/contacts')
			.set('X-API-TOKEN', 'example')
			.send({
				firstName: 'oreo',
				lastName: 'ataya',
				email: 'oreo@example.com',
				phone: '081234567890',
			});

		logger.debug(response.body);
		expect(response.status).toEqual(201);
		expect(response.body.data.firstName).toBe('oreo');
		expect(response.body.data.lastName).toBe('ataya');
		expect(response.body.data.email).toBe('oreo@example.com');
		expect(response.body.data.phone).toBe('081234567890');
	});

	it('should reject create new contact if data is invalid', async () => {
		const response = await supertest(app)
			.post('/api/v1/contacts')
			.set('X-API-TOKEN', 'example')
			.send({
				firstName: '',
				lastName: '',
				email: 'wrongemail',
				phone: '1283123791827391827398172391723971293871982319890',
			});

		logger.debug(response.body);
		expect(response.status).toEqual(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe('GET /api/v1/contacts/:contactId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to get contact by id', async () => {
		const contact = await ContactTest.get();
		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id}`)
			.set('X-API-TOKEN', 'example');

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.firstName).toBe('example');
		expect(response.body.data.lastName).toBe('example');
		expect(response.body.data.email).toBe('example@example.com');
		expect(response.body.data.phone).toBe('081234567890');
	});

	it('should reject get contact if contact is not found', async () => {
		const contact = await ContactTest.get();
		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id + 1}`)
			.set('X-API-TOKEN', 'example');

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
