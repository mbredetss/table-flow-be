import express from 'express';
import verifySignatureKey from '../../../middlewares/verifySignatureKey.js';
import { midTransNotifications } from '../controller/notifications-controller.js';

const router = express.Router();

router.post('/', verifySignatureKey, midTransNotifications);

export default router;