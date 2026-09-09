import express from 'express';
import {
    getCustomers,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController';
import { requireAdminAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', requireAdminAuth, getCustomers);
router.put('/:id', requireAdminAuth, updateCustomer);
router.delete('/:id', requireAdminAuth, deleteCustomer);

export default router;
