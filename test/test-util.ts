import { Contact, User } from '@prisma/client';
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

	static async create() {
		await prismaClient.contact.create({
			data: {
				firstName: 'example',
				lastName: 'example',
				email: 'example@example.com',
				phone: '081234567890',
				username: 'example',
			},
		});
	}

	static async get(): Promise<Contact> {
		const contact = await prismaClient.contact.findFirst({
			where: {
				username: 'example',
			},
		});

		if (!contact) {
			throw new Error('Contact not found');
		}

		return contact;
	}
}

export class AddressTest {
	static async deleteAll() {
		await prismaClient.address.deleteMany({
			where: {
				contact: {
					username: 'example',
				},
			},
		});
	}
}
