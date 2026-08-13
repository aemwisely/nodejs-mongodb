import { Router } from 'express';

import { appConfig } from '../config/app.config';
import { v1Routes } from './v1.routes';

const router = Router();

router.use(`/v${appConfig.defaultVersion}`, v1Routes);

export const apiRoutes = router;
