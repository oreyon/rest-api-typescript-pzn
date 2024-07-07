import { Request, Response, NextFunction } from 'express';
import {
	CreateUserRequest,
	LoginUserRequest,
	UpdateUserRequest,
} from '../model/user-model';
import { UserService } from '../service/user-service';
import { UserRequest } from '../type/user-request';
import { attachCookiesToResponse } from '../utils/jwt';
import { string } from 'zod';
import { prismaClient } from '../application/database';

export class UserController {
	static async register(req: Request, res: Response, next: NextFunction) {
		try {
			const request: CreateUserRequest = req.body;
			const response = await UserService.register(request);
			res.status(201).json({ data: response });
		} catch (e) {
			next(e);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const request: LoginUserRequest = req.body as LoginUserRequest;
			const response = await UserService.login(request);

			attachCookiesToResponse(
				res,
				response.accessToken!,
				response.refreshToken!
			);

			// Optionally, you can remove the token from the response body
			// delete response.token;
			// end

			// console.log(`CHECK TOKEN`);
			// const accessToken = req.signedCookies.accessTokenCookie;
			// const refreshToken = req.signedCookies.refreshTokenCookie;
			// console.log(`accessToken: ${accessToken}`);
			// console.log(`refreshToken: ${refreshToken}`);

			console.log(`Response from login controller` + response);
			console.log(`Result from request` + request);

			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async getCurrentUser(
		req: UserRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const response = await UserService.getCurrentUser(req.user!);
			// console.log(`CHECK TOKEN`);
			// const accessToken = req.signedCookies.accessTokenCookie;
			// const refreshToken = req.signedCookies.refreshTokenCookie;
			// console.log(`accessToken: ${accessToken}`);
			// console.log(`refreshToken: ${refreshToken}`);
			// console.log(`User request: `, req.user);
			// console.log(`Response get current user: `, response);
			res.status(200).json({ data: response });
		} catch (e) {
			next(e);
		}
	}

	static async updateUser(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const request: UpdateUserRequest = req.body as UpdateUserRequest;
			const response = await UserService.updateUser(req.user!, request);

			const accessToken = await prismaClient.user.findFirst({
				where: {
					accessToken: null,
				},
			});

			if (accessToken) {
				res.clearCookie('accessToken');
				res.clearCookie('refreshToken');
			}

			res.status(200).json({ data: response });
		} catch (e) {
			next(e);
		}
	}

	static async logout(req: UserRequest, res: Response, next: NextFunction) {
		try {
			await UserService.logout(req.user!);
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			res.status(200).json({ data: 'Logout Success' });
		} catch (e) {
			next(e);
		}
	}
}
