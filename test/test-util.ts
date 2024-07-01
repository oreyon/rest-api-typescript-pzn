import { User } from '@prisma/client';
import { prismaClient } from '../src/application/database';
import bycrypt from 'bcrypt';

export class UserTest {
	static async delete() {
		await prismaClient.user.deleteMany({
			where: {
				username: 'example',
			},
		});
	}

	static async create() {
		await prismaClient.user.create({
			data: {
				username: 'example',
				password: await bycrypt.hash('example', 10),
				name: 'example',
				token: 'example',
			},
		});
	}

	static async getDataUser(): Promise<User> {
		const user = await prismaClient.user.findFirst({
			where: {
				username: 'example',
			},
		});

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}
}

export class ContactTest {
	static async deleteAll() {
		await prismaClient.contact.deleteMany({
			where: {
				user: {
					username: 'example',
				},
			},
		});
	}
}
