// ... ייבוא המודלים נשאר זהה ...

// עדכון סטטוס תשלום או הזמנה (שינוי שם ל-updatePaymentStatus)
export async function updatePaymentStatus(req, res) {
    let orderId = req.params.id;
    let { status } = req.body; 

    try {
        let order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ title: "הזמנה לא נמצאה", message: "לא קיימת הזמנה עם מזהה זה" });

        // אם ב-body לא עבר סטטוס, אולי זו רק בקשה לסמן כ'שולם'
        order.status = status || 'paid'; 
        
        await order.save();
        return res.json(order);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון ההזמנה", message: err.message });
    }
}

// שאר הפונקציות (getOrders, addOrder, cancelOrder, getOrderById, getOrdersByUser) נשארות כפי שהן