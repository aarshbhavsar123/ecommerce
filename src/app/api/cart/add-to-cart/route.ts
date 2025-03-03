import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartSchema";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { product_id, quantity, userId } = await request.json();

        if (!product_id || !quantity || !userId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        
        const product = await Product.findById(product_id).lean(); // Use `.lean()` to get a plain object
        if (!product) {
            return NextResponse.json({ message: "Invalid product ID" }, { status: 404 });
        }
        
        let cart = await Cart.findOne({ owner_id: userId });

        if (cart) {
            let productIndex = cart.products.findIndex((p: { product: { _id: string } }) => p.product._id.toString() === product_id);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity }); 
            }
            console.log(cart.products);
            await cart.save();
            return NextResponse.json({ message: "Cart updated successfully", cart }, { status: 200 });
        } else {
            cart = new Cart({
                owner_id: userId,
                products: [{ product, quantity }]
            });

            await cart.save();
            return NextResponse.json({ message: "New cart created and product added", cart }, { status: 201 });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
