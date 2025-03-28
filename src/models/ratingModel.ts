import mongoose from "mongoose";
const ratingModel = new mongoose.Schema({
    productId:{
        type:String,
    },
    ratings:[
        {
            userId:{type:String},
            rating:{type:Number}
        }
    ]
});
const Rating = mongoose.models.Rating||mongoose.model("Rating",ratingModel);
export default Rating;