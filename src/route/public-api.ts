import express from 'express';
import { UserController } from '../controller/user-controller';

export const publicRouter = express.Router();

publicRouter.post('/api/v1/users/register', UserController.register);
publicRouter.post('/api/v1/users/login', UserController.login);
