import express from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';

const router = express.Router();

router.use('/users', users);
router.use('/authentications', authentications);

export default router;