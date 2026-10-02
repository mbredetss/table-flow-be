import express from 'express';
import validate from '../../../middlewares/validate.js';
import { orderPayloadSchema } from '../validator/schema.js';
import { getOrder, orderMenu } from '../controller/orders-controller.js';

const router = express.Router();

router.post('/', validate(orderPayloadSchema), orderMenu);
router.get('/', getOrder);

export default router;