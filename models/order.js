import mongoose from "mongoose";


const clockMinimalSchema = new mongoose.Schema({
    company: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imgUrl: { type: String, required: true }
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: clockMinimalSchema,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['creditCard', 'paypal', 'bankTransfer', 'cash'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notes: String
},{ timestamps: true }
)

export const orderModel=mongoose.model('orders',orderSchema)
