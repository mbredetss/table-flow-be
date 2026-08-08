import express from 'express';
import authentications from '../services/authentications/routes/index.js';
import menus from '../services/menus/routes/index.js';

const router = express.Router();

router.use('/authentications', authentications);
router.use('/menus', menus);

export default router;