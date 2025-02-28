import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    owner_id: {
        type: String,
        unique: true
    },
    products: [
        {
            product_id: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
