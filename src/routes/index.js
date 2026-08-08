import express from 'express';
import authentications from '../services/authentications/routes/index.js';

const router = express.Router();

router.use('/authentications', authentications);

export default router;