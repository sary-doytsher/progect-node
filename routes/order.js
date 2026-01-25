import express from 'express';
// ייבוא מפורש של כל הפונקציות מהקונטרולר
import { 
    getOrders, 
    getOrderById, 
    getOrdersByUser, 
    addOrder, 
    updatePaymentStatus, 
    cancelOrder 
} from "../controllers/order.js";

const router = express.Router();

// שימוש ישיר בשמות הפונקציות
router.get('/', getOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUser);
router.post('/', addOrder);
router.put('/:id', updatePaymentStatus);
router.delete('/:id', cancelOrder);

export default router;