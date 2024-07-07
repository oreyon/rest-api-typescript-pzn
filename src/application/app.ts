import express from 'express';
import { publicRouter } from '../route/public-api';
import { errorMiddleware } from '../middleware/error-middleware';
import { apiRouter } from '../route/api';
import cookieParser from 'cookie-parser';

export const app = express();
app.use(express.json());
app.use(cookieParser('secret'));
app.use(express.urlencoded({ extended: true }));
app.use(publicRouter);
app.use(apiRouter);
app.use(errorMiddleware);
