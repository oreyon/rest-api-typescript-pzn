import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';

describe('POST /api/v1/users', () => {
	afterEach(async () => {
		await UserTest.delete();
	});

	it('should reject register new user if request is invalid', async () => {
		const response = await supertest(app).post('/api/v1/users').send({
			username: '',
			password: '',
			name: '',
		});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it('should register new user', async () => {
		const response = await supertest(app).post('/api/v1/users').send({
			username: 'example',
			password: 'example',
			name: 'example',
		});
		logger.debug(response.body);
		expect(response.status).toBe(201);
		expect(response.body.data.username).toBe('example');
		expect(response.body.data.name).toBe('example');
	});
});

describe('POST /api/v1/users/login', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await UserTest.delete();
	});

	it('should be able to login', async () => {
		const response = await supertest(app).post('/api/v1/users/login').send({
			username: 'example',
			password: 'example',
		});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe('example');
		expect(response.body.data.name).toBe('example');
		expect(response.body.data.token).toBeDefined();
	});

	it('should reject login user if username is wrong', async () => {
		const response = await supertest(app).post('/api/v1/users/login').send({
			username: 'salah',
			password: 'example',
		});

		logger.debug(response.body);
		expect(response.status).toBe(401);
		expect(response.body.errors).toBeDefined();
	});

	it('should reject login user if password is wrong', async () => {
		const response = await supertest(app).post('/api/v1/users/login').send({
			username: 'example',
			password: 'passwordsalah',
		});

		logger.debug(response.body);
		expect(response.status).toBe(401);
		expect(response.body.errors).toBeDefined();
	});
});
