import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const logging = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
};

export default logging;
