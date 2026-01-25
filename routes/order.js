import express from 'express';
import * as orderControllers from "../controllers/order.js";

const router = express.Router();

// שליפת כל ההזמנות - GET api/orders
router.get('/', orderControllers.getOrders);

// שליפת הזמנה ספציפית - GET api/orders/:id
router.get("/:id", orderControllers.getOrderById);

// שליפת הזמנות לפי קוד משתמש - GET api/orders/user/:userId
router.get("/user/:userId", orderControllers.getOrdersByUser);

// הוספת הזמנה חדשה - POST api/orders
router.post('/', orderControllers.addOrder);

// עדכון סטטוס תשלום/הזמנה - PUT api/orders/:id
router.put('/:id', orderControllers.updatePaymentStatus); // התאמה לשם הפונקציה בתיעוד

// ביטול הזמנה (אם טרם שולמה) - DELETE api/orders/:id
router.delete('/:id', orderControllers.cancelOrder);

export default router;