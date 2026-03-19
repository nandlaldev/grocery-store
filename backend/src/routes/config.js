import { Router } from 'express';
import { getAppConfig } from '../controllers/configController.js';

const router = Router();

router.get('/', getAppConfig);

export default router;
