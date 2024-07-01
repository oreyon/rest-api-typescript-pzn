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
}
