import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    brand:{
        type:String,
    },
    seller_id: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    images:[
        {
            type:String
        }
    ],
    description:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
