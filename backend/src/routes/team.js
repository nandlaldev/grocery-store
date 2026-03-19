import { Router } from 'express';
import { listTeamMembers } from '../controllers/teamController.js';

const router = Router();

router.get('/', listTeamMembers);

export default router;
