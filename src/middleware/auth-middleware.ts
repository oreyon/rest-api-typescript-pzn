// import { Request, Response, NextFunction } from 'express';
// import { prismaClient } from '../application/database';
// import { UserRequest } from '../type/user-request';

// export const authMiddleware = async (
// 	req: UserRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const token = req.get('X-API-TOKEN');

// 	if (token) {
// 		const user = await prismaClient.user.findFirst({
// 			where: {
// 				token: token,
// 			},
// 		});

// 		if (user) {
// 			req.user = user;
// 			next();
// 			return;
// 		}
// 	}

// 	res.status(401).json({ errors: 'Unauthorized' }).end();
// };
//================================================

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { prismaClient } from '../application/database';
// import { UserRequest } from '../type/user-request';

// export const authMiddleware = async (
// 	req: UserRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const token = req.signedCookies['accessToken'];

// 	if (!token) {
// 		return res.status(401).json({ errors: 'No token provided' }).end();
// 	}

// 	try {
// 		const decoded = jwt.verify(token, 'secret') as {
// 			username: string;
// 		};
// 		const user = await prismaClient.user.findUnique({
// 			where: {
// 				username: decoded.username,
// 			},
// 		});

// 		if (!user) {
// 			return res.status(401).json({ errors: 'Invalid token' }).end();
// 		}

// 		req.user = user;
// 		next();
// 	} catch (err) {
// 		return res.status(401).json({ errors: 'Token expired or invalid' }).end();
// 	}
// };
//================================================

// import { Request, Response, NextFunction } from 'express';
// import { prismaClient } from '../application/database';
// import { UserRequest } from '../type/user-request';
// import { isTokenValid } from '../utils/jwt';

// export const authMiddleware = async (
// 	req: UserRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const token = req.signedCookies.accessToken;

// 	if (token) {
// 		try {
// 			const payload = isTokenValid(token);
// 			const user = await prismaClient.user.findUnique({
// 				where: { username: payload.username },
// 			});

// 			if (user) {
// 				req.user = user;
// 				return next();
// 			}
// 		} catch (error) {
// 			return res.status(401).json({ errors: 'Unauthorized' }).end();
// 		}
// 	}

// 	res.status(401).json({ errors: 'Unauthorized' }).end();
// };

//================================================
// import { Request, Response, NextFunction } from 'express';
// import { prismaClient } from '../application/database';
// import { UserRequest } from '../type/user-request';
// import { isTokenValid, createJWT, attachCookiesToResponse } from '../utils/jwt';

// export const authMiddleware = async (
// 	req: UserRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const { accessToken, refreshToken } = req.signedCookies;

// 	if (accessToken) {
// 		try {
// 			const payload = isTokenValid(accessToken);
// 			const user = await prismaClient.user.findUnique({
// 				where: { username: payload.username },
// 			});

// 			if (user) {
// 				req.user = user;
// 				return next();
// 			}
// 		} catch (error) {
// 			// Access token invalid or expired
// 		}
// 	}

// 	if (refreshToken) {
// 		try {
// 			const payload = isTokenValid(refreshToken);
// 			const user = await prismaClient.user.findUnique({
// 				where: { username: payload.username, token: refreshToken },
// 			});

// 			if (user) {
// 				// Generate new access token
// 				const newAccessToken = createJWT({ username: user.username }, '1h');
// 				attachCookiesToResponse(res, newAccessToken, refreshToken);

// 				req.user = user;
// 				return next();
// 			}
// 		} catch (error) {
// 			// Refresh token invalid or expired
// 		}
// 	}

// 	res.status(401).json({ errors: 'Unauthorized' }).end();
// };

// =================================================

// import { Request, Response, NextFunction } from 'express';
// import { prismaClient } from '../application/database';
// import { UserRequest } from '../type/user-request';
// import { isTokenValid } from '../utils/jwt';

// export const authMiddleware = async (
// 	req: UserRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	// put token in header
// 	// const token = req.get('X-API-TOKEN');
// 	// const accessToken = req.get('accessToken');
// 	// const refreshToken = req.get('refreshToken');

// 	// put token in cookie
// 	const { accessToken, refreshToken } = req.signedCookies;
// 	// const { accessTokenCookie } = req.signedCookies;
// 	if (accessToken) {
// 		try {
// 			const payload = isTokenValid(accessToken);
// 			const user = await prismaClient.user.findFirst({
// 				where: { username: payload.username },
// 			});

// 			if (user) {
// 				req.user = user;
// 				return next();
// 			}
// 		} catch (error) {
// 			console.log('Access token error:', error);

// 			// Invalid access token, attempt to use refresh token
// 			if (refreshToken) {
// 				try {
// 					const payload = isTokenValid(refreshToken);
// 					const user = await prismaClient.user.findFirst({
// 						where: { username: payload.username },
// 					});

// 					if (user) {
// 						req.user = user;
// 						return next();
// 					}
// 				} catch (refreshError) {
// 					// Handle refresh token error if necessary
// 				}
// 			}
// 		}
// 	}
// 	res.status(401).json({ errors: 'Unauthorized' }).end();
// };

// =================================================
import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { UserRequest } from '../type/user-request';
import { attachCookiesToResponse, createJWT, isTokenValid } from '../utils/jwt';
import { error } from 'console';

export const authMiddleware = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	// Get tokens from cookies
	const { accessToken, refreshToken } = req.signedCookies;

	if (!accessToken) {
		return res.status(401).json({ errors: 'No token provided' }).end();
	}

	if (!refreshToken) {
		return res.status(401).json({ errors: 'No refresh token provided' }).end();
	}

	if (accessToken !== req.signedCookies.accessToken) {
		return res.status(401).json({ errors: 'Invalid credentials' }).end();
	}

	if (refreshToken !== req.signedCookies.refreshToken) {
		return res.status(401).json({ errors: 'Invalid refresh token' }).end();
	}

	if (accessToken) {
		try {
			// find user by access token directly
			const user = await prismaClient.user.findFirst({
				where: { accessToken: accessToken },
			});

			if (user) {
				req.user = user;
				return next();
			}
		} catch (error) {
			console.log('Access token error:', error);
		}
	}
	// // Invalid access token, attempt to use refresh token
	// if (refreshToken) {
	// 	try {
	// 		const payload = isTokenValid(refreshToken);
	// 		const user = await prismaClient.user.findFirst({
	// 			where: { username: payload.username },
	// 		});

	// 		if (user) {
	// 			req.user = user;
	// 			return next();
	// 		}
	// 	} catch (refreshError) {
	// 		console.log('Refresh token error:', refreshError);
	// 	}
	// }

	// If access token is invalid, attempt to use refresh token
	if (refreshToken) {
		try {
			const payload = isTokenValid(refreshToken);
			const user = await prismaClient.user.findFirst({
				where: { username: payload.username },
			});

			if (user) {
				// Create a new access token
				const newAccessToken = createJWT({ username: user.username });

				// Update user's access token in the database
				await prismaClient.user.update({
					where: { username: user.username },
					data: { accessToken: newAccessToken },
				});

				// Attach new access token to response cookies
				attachCookiesToResponse(res, newAccessToken, refreshToken);

				req.user = user;
				return next();
			}
		} catch (refreshError) {
			console.log('Refresh token error:', refreshError);
		}
	}

	res.status(401).json({ errors: `Unauthorized` }).end();
};
