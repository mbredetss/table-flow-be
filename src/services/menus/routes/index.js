import express from 'express';
import validate from '../../../middlewares/validate.js';
import authenticate from '../../../middlewares/authenticate.js';
import { addMenuPayloadSchema } from '../validator/schema.js';
import { addMenu } from '../controller/menu-controller.js';

const router = express.Router();

router.post('/', validate(addMenuPayloadSchema), authenticate, addMenu);

export default router;