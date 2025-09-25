 import mongoose from "mongoose";


 const rateSchema = new Schema({
    rate:{
        type:String,
        required:true,
        unique:true
    },
    postId:{
     type:String,
     required:true,
    },
    categoryId:{
     type:String,
     required:true,
    },
    sizeId:{
     type:String,
     required:true,
    },
 })

 const Rates = mongoose.models.Rate || mongoose.model("Rates",rateSchema);

 export default Rates;