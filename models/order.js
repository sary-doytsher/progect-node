import mongoose from "mongoose";


const clockMinimalSchema = new mongoose.Schema({
    company: String,
    price: Number,
    imgUrl: String
})

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
},{ timestamps: true }
)

export const orderModel=mongoose.model('orders',orderSchema)
