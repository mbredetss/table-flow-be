import express from 'express';
import authenticate from '../../../middlewares/authenticate.js';
import validate from '../../../middlewares/validate.js';
import { tableCountPayloadSchema } from '../validator/schema.js';
import { setTableCount } from '../controller/table-controller.js';

const router = express.Router();

router.post('/', validate(tableCountPayloadSchema), authenticate, setTableCount);

export default router;