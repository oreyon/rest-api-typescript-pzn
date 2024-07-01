import {
	CreateUserRequest,
	LoginUserRequest,
	UpdateUserRequest,
	UserResponse,
	toUserResponse,
} from '../model/user-model';
import { Validation } from '../validation/validation';
import { UserValidation } from '../validation/user-validation';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { response } from 'express';
import { User } from '@prisma/client';
export class UserService {
	static async register(request: CreateUserRequest): Promise<UserResponse> {
		// Validate the request using the UserValidation.REGISTER schema
		const registerRequest = Validation.validate(
			UserValidation.REGISTER,
			request
		);

		// Check if the username already exists
		const totalUserWithSameUsername = await prismaClient.user.count({
			where: {
				username: registerRequest.username,
			},
		});

		// If the username already exists, throw a 400 error
		if (totalUserWithSameUsername != 0) {
			throw new ResponseError(400, 'Username already exists');
		}

		// Hash the password
		registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

		// Create the user
		const user = await prismaClient.user.create({
			data: registerRequest,
		});

		// Return the user response
		return toUserResponse(user);
	}

	static async login(request: LoginUserRequest): Promise<UserResponse> {
		const loginRequest = Validation.validate(UserValidation.LOGIN, request);

		let user = await prismaClient.user.findUnique({
			where: {
				username: loginRequest.username,
			},
		});

		if (!user) {
			throw new ResponseError(401, 'Username or password is wrong');
		}

		const isPasswordValid = await bcrypt.compare(
			loginRequest.password,
			user.password
		);
		if (!isPasswordValid) {
			throw new ResponseError(401, 'Username or password is wrong');
		}

		user = await prismaClient.user.update({
			where: {
				username: loginRequest.username,
			},
			data: {
				token: uuid(),
			},
		});

		const response = toUserResponse(user);
		response.token = user.token!;
		return response;
	}

	static async getCurrentUser(user: User): Promise<UserResponse> {
		return toUserResponse(user);
	}

	static async updateUser(
		user: User,
		request: UpdateUserRequest
	): Promise<UserResponse> {
		// validate the request using the UserValidation.UPDATE schema
		const updateRequest = Validation.validate(UserValidation.UPDATE, request);

		// check if the name is provided
		if (updateRequest.name) {
			user.name = await updateRequest.name;
		}

		// check if the password is provided
		if (updateRequest.password) {
			user.password = await bcrypt.hash(updateRequest.password, 10);
		}

		// update the user
		const result = await prismaClient.user.update({
			where: {
				username: user.username,
			},
			data: user,
		});

		// will be remove redline under Promise<UserResponse>
		return toUserResponse(result);
	}

	static async logout(user: User): Promise<UserResponse> {
		const result = await prismaClient.user.update({
			where: {
				username: user.username,
			},
			data: {
				token: null,
			},
		});

		return toUserResponse(result);
	}
}
