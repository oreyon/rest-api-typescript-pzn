import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { UserController } from '../controller/user-controller';

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// user api
apiRouter.get('/api/v1/users/current', UserController.getCurrentUser);
apiRouter.patch('/api/v1/users/current', UserController.updateUser);
apiRouter.delete('/api/v1/users/current', UserController.logout);
