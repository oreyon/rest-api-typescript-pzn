import { app } from './application/app';
import { logger } from './application/logging';

const port = process.env.PORT || 5000;
app.listen(port, () => {
	logger.info(`Server is running on port ${port}`);
});
