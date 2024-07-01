import {
	CreateUserRequest,
	UserResponse,
	toUserResponse,
} from '../model/user-model';
import { Validation } from '../validation/validation';
import { UserValidation } from '../validation/user-validation';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import bcrypt from 'bcrypt';

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
}
