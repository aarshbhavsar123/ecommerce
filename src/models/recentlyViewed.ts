import { timeStamp } from "console";
import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema({
    userId: { 
        type:String,
     }, 
    products: [
        {
            product: { type: String},
            viewedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Recent = mongoose.models.Recent || mongoose.model("Recent", recentlyViewedSchema);
export default Recent;
