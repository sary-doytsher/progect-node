import mongoose from "mongoose";

// הגדרת הסכימה של מוצר מינימלי
const clockMinimalSchema = new mongoose.Schema({
    company: String,
    price: Number,
    imgUrl: String
});

// הגדרת סכימת ההזמנה
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: clockMinimalSchema,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export const orderModel = mongoose.model('orders', orderSchema);

// --- פונקציות הקונטרולר ---

// שליפת כל ההזמנות
export const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת ההזמנות", error: error.message });
    }
};

// שליפת הזמנה לפי ID
export const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת ההזמנה", error: error.message });
    }
};

// שליפת כל ההזמנות של משתמש ספציפי
export const getOrdersByUser = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת הזמנות המשתמש", error: error.message });
    }
};

// הוספת הזמנה חדשה
export const addOrder = async (req, res) => {
    try {
        const newOrder = new orderModel(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: "שגיאה ביצירת ההזמנה", error: error.message });
    }
};

// עדכון סטטוס הזמנה (למשל תשלום)
export const updatePaymentStatus = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "הזמנה לא נמצאה לעדכון" });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: "שגיאה בעדכון ההזמנה", error: error.message });
    }
};

// ביטול הזמנה (מחיקה)
export const cancelOrder = async (req, res) => {
    try {
        const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: "הזמנה לא נמצאה למחיקה" });
        res.status(200).json({ message: "ההזמנה בוטלה בהצלחה" });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בביטול ההזמנה", error: error.message });
    }
};