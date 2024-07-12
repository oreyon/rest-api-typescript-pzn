import express from 'express';
import { UserController } from '../controller/user-controller';

export const publicRouter = express.Router();

publicRouter.get('/', (req, res) => {
	res.send('Success');
});

publicRouter.get('/api/v1/', (req, res) => {
	res.send('Hello World!');
});
publicRouter.post('/api/v1/users/register', UserController.register);
publicRouter.post('/api/v1/users/login', UserController.login);
