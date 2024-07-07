import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { ContactTest, UserTest } from './test-util';
import e from 'express';

describe('POST /api/v1/contacts', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should create new contact', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.post('/api/v1/contacts')
			.set('Cookie', cookies)
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
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.post('/api/v1/contacts')
			.set('Cookie', cookies)
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
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.firstName).toBe('example');
		expect(response.body.data.lastName).toBe('example');
		expect(response.body.data.email).toBe('example@example.com');
		expect(response.body.data.phone).toBe('081234567890');
	});

	it('should reject get contact if contact is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.get(`/api/v1/contacts/${contact.id + 1}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe('PUT /api/v1/contacts/:contactId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to update contact by id', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id}`)
			.set('Cookie', cookies)
			.send({
				firstName: 'example',
				lastName: 'example',
				email: 'example@example.com',
				phone: '081234567890',
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBe(contact.id);
		expect(response.body.data.firstName).toBe('example');
		expect(response.body.data.lastName).toBe('example');
		expect(response.body.data.email).toBe('example@example.com');
		expect(response.body.data.phone).toBe('081234567890');
	});

	it('should reject update contact if request is invalid', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.put(`/api/v1/contacts/${contact.id}`)
			.set('Cookie', cookies)
			.send({
				firstName: '',
				lastName: '',
				email: 'example',
				phone: '',
			});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe('DELETE /api/v1/contacts/:contactId', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to delete contact by id', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.delete(`/api/v1/contacts/${contact.id}`)
			.set('Cookie', cookies)
			.send({
				code: 200,
				status: 'success',
				message: 'Contact deleted successfully',
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Contact deleted successfully');
	});

	it('should reject to delete contact if contact is not found', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const contact = await ContactTest.get();
		const response = await supertest(app)
			.delete(`/api/v1/contacts/${contact.id + 1}`)
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe('GET /api/v1/contacts', () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it('should be able to search contacts', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.currentPage).toBe(1);
		expect(response.body.paging.totalPage).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it('should be able to search contacts using name', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.query({ name: 'mple' })
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.currentPage).toBe(1);
		expect(response.body.paging.totalPage).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it('should be able to search contacts using email', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.query({ email: 'example@example.com' })
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.currentPage).toBe(1);
		expect(response.body.paging.totalPage).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it('should be able to search contacts using phone', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.query({ phone: '78' })
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.currentPage).toBe(1);
		expect(response.body.paging.totalPage).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it('should be able to search contact no result', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.query({ name: 'wrongExample' })
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(0);
		expect(response.body.paging.currentPage).toBe(1);
		expect(response.body.paging.totalPage).toBe(0);
		expect(response.body.paging.size).toBe(10);
	});

	it('should be able to search contact with paging', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.get('/api/v1/contacts')
			.query({ page: 2, size: 1 })
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.code).toBe(200);
		expect(response.body.status).toBe('success');
		expect(response.body.message).toBe('Search contact success');
		expect(response.body.data.length).toBe(0);
		expect(response.body.paging.currentPage).toBe(2);
		expect(response.body.paging.totalPage).toBe(1);
		expect(response.body.paging.size).toBe(1);
	});
});
