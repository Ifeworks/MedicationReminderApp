import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;