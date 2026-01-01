import express from 'express';
import * as orderControllers from "../controllers/order.js";

const router = express.Router();
router.get('/', orderControllers.getOrders);
router.post('/', orderControllers.addOrder);
router.delete('/:id', orderControllers.cancelOrder);
router.put('/:id/status', orderControllers.updateOrderStatus); 
router.get("/:id", orderControllers.getOrderById);
router.get("/user/:userId", orderControllers.getOrdersByUser);
export default router;