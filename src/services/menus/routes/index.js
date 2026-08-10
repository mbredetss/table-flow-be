import express from 'express';
import validate from '../../../middlewares/validate.js';
import authenticate from '../../../middlewares/authenticate.js';
import { menuPayloadSchema } from '../validator/schema.js';
import { addMenu, deleteMenu, editMenu, getMenus } from '../controller/menu-controller.js';

const router = express.Router();

router.post('/', validate(menuPayloadSchema), authenticate, addMenu);
router.put('/:id', validate(menuPayloadSchema), authenticate, editMenu);
router.delete('/:id', authenticate, deleteMenu);
router.get('/', getMenus);

export default router;