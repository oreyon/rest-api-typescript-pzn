import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';
import bycript from 'bcrypt';
import { createJWT } from '../src/utils/jwt';

describe('POST /api/v1/users/register', () => {
	afterEach(async () => {
		await UserTest.delete();
	});

	it('should reject register new user if request is invalid', async () => {
		const response = await supertest(app).post('/api/v1/users/register').send({
			username: '',
			password: '',
			name: '',
		});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it('should register new user', async () => {
		const response = await supertest(app).post('/api/v1/users/register').send({
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

		// console.log(response.body);
		// console.log(response.headers);

		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe('example');
		expect(response.body.data.name).toBe('example');
		expect(response.body.data.accessToken).toBeDefined();
		expect(response.body.data.refreshToken).toBeDefined();
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

describe('GET /api/v1/users/current', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await UserTest.delete();
	});

	it('should be able to get current user', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		// check response and cookies
		// console.log(body.data.accessToken);
		// console.log(body.data.refreshToken);
		// console.log(headers);

		const response = await supertest(app)
			.get('/api/v1/users/current')
			.set('Cookie', cookies);

		logger.debug(response.body);
		// debug response
		// console.log(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe('example');
		expect(response.body.data.name).toBe('example');
	});

	it('should reject get user if token is invalid', async () => {
		const response = await supertest(app)
			.get('/api/v1/users/current')
			.set('X-API-TOKEN', 'wrongtoken');

		logger.debug(response.body);
		expect(response.status).toBe(401);
		expect(response.body.errors).toBeDefined();
	});
});

describe('PATCH /api/v1/users/current', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await UserTest.delete();
	});

	it('should reject update user if request is invalid', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.patch('/api/v1/users/current')
			.set('Cookie', cookies)
			.send({
				name: '',
				password: '',
			});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it('should reject update user if request token is wrong', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.patch('/api/v1/users/current')
			.set('Cookie', 'wrongtoken')
			.send({
				name: 'example',
				password: 'example',
			});

		logger.debug(response.body);
		expect(response.status).toBe(401);
		expect(response.body.errors).toBeDefined();
	});

	it('should be able to be update username', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.patch('/api/v1/users/current')
			.set('Cookie', cookies)
			.send({
				name: 'example',
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe('example');
	});

	it('should be able to be update password', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.patch('/api/v1/users/current')
			.set('Cookie', cookies)
			.send({
				password: 'exampleTest',
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);

		const user = await UserTest.getDataUser();
		expect(await bycript.compare('exampleTest', user.password)).toBe(true);
	});
});

describe('DELETE /api/v1/users/current', () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await UserTest.delete();
	});

	it('should be able to logout', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.delete('/api/v1/users/current')
			.set('Cookie', cookies);

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data).toBe('Logout Success');

		const user = await UserTest.getDataUser();
		expect(user.accessToken).toBeNull();
	});

	it('should reject logout user if token is wrong', async () => {
		const { body, headers } = await supertest(app)
			.post('/api/v1/users/login')
			.send({
				username: 'example',
				password: 'example',
			});
		const cookies = headers['set-cookie'];

		const response = await supertest(app)
			.delete('/api/v1/users/current')
			.set('Cookie', 'wrongtoken');

		logger.debug(response.body);
		expect(response.status).toBe(401);
		expect(response.body.errors).toBeDefined();
	});
});
