import express from 'express';
import validate from '../../../middlewares/validate.js';
import { orderPayloadSchema, updateOrderStatusPayloadSchema } from '../validator/schema.js';
import { getOrderSSE, orderMenu, updateOrderStatus } from '../controller/orders-controller.js';
import authenticateToken from '../../../middlewares/authenticate.js';

const router = express.Router();

router.post('/', validate(orderPayloadSchema), orderMenu);
router.get('/sse', getOrderSSE);
router.put('/:id', validate(updateOrderStatusPayloadSchema), authenticateToken,  updateOrderStatus);

export default router;