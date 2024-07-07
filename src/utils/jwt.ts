// import { Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { string } from 'zod';

// const secret = process.env.JWT_SECRET || 'secret';

// interface Payload {
// 	username: string;
// }

// export const createJWT = (payload: Payload): string => {
// 	return jwt.sign(payload, secret, { expiresIn: '1h' });
// };

// export const isTokenValid = (token: string): Payload => {
// 	return jwt.verify(token, secret) as Payload;
// };

// export const attachCookiesToResponse = (res: Response, token: string) => {
// 	const oneDay = 1000 * 60 * 60 * 24;
// 	const oneMinutes = 1000 * 60;
// 	const tenSeconds = 1000 * 10;

// 	res.cookie('accessToken', token, {
// 		httpOnly: true,
// 		expires: new Date(Date.now() + oneMinutes),
// 		secure: process.env.NODE_ENV === 'production',
// 		signed: true,
// 	});
// };

// =================================================

// import { Response } from 'express';
// import jwt from 'jsonwebtoken';

// const secret = process.env.JWT_SECRET || 'secret';

// interface Payload {
// 	username: string;
// }

// export const createJWT = (
// 	payload: Payload,
// 	expiresIn: string = '1h'
// ): string => {
// 	return jwt.sign(payload, secret, { expiresIn });
// };

// export const isTokenValid = (token: string): Payload => {
// 	return jwt.verify(token, secret) as Payload;
// };

// export const attachCookiesToResponse = (
// 	res: Response,
// 	accessToken: string,
// 	refreshToken: string
// ) => {
// 	const oneDay = 1000 * 60 * 60 * 24;
// 	const oneMonth = 1000 * 60 * 60 * 24 * 30;

// 	res.cookie('accessToken', accessToken, {
// 		httpOnly: true,
// 		expires: new Date(Date.now() + oneDay),
// 		secure: process.env.NODE_ENV === 'production',
// 		signed: true,
// 	});

// 	res.cookie('refreshToken', refreshToken, {
// 		httpOnly: true,
// 		expires: new Date(Date.now() + oneMonth),
// 		secure: process.env.NODE_ENV === 'production',
// 		signed: true,
// 	});
// };

// =================================================
import { Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface Payload {
	username: string;
}

export const createJWT = (payload: Payload): string => {
	return jwt.sign(payload, JWT_SECRET!);
};

export const isTokenValid = (token: string): Payload => {
	return jwt.verify(token, JWT_SECRET!) as Payload;
};

export const attachCookiesToResponse = (
	res: Response,
	accessToken: string,
	refreshToken: string
) => {
	const oneMonth = 1000 * 60 * 60 * 24 * 30;
	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === 'production',
		signed: true,
	});

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		expires: new Date(Date.now() + oneMonth),
		secure: process.env.NODE_ENV === 'production',
		signed: true,
	});
};

// =================================================
