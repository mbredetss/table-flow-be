import express from 'express';
import authentications from '../services/authentications/routes/index.js';
import menus from '../services/menus/routes/index.js';
import orders from '../services/orders/routes/index.js';
import tables from '../services/tables/routes/index.js';

const router = express.Router();

router.use('/authentications', authentications);
router.use('/menus', menus);
router.use('/orders', orders);
router.use('/tables', tables);

export default router;