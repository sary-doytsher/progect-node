import mongoose from "mongoose";


export const clockSchema=new mongoose.Schema({
company: { type: String, required: true },
price: { type: Number, required: true, min: 0 },
imgUrl: { type: String, required: true },
description: String,
countryOfManufacture: String

})
export const clockModel=mongoose.model('clock',clockSchema)