import mongoose from "mongoose";


export const clockSchema=new mongoose.Schema({
company:String,
price:Number,
imgUrl:String,
description:String,
countryOfManufacture:String

})
export const clockModel=mongoose.model('clock',clockSchema)