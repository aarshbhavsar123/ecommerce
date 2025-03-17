import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Recent from "@/models/recentlyViewed";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {

    try {
        const { productId, userId } = await request.json();
        
        const productExists = await Product.findById(productId);
        console.log(productExists);
        if (!productExists) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        const currentTimestamp = new Date().toISOString();
        let userRecent = await Recent.findOne({ userId: userId });
        if (!userRecent) {
            userRecent = new Recent({
                userId: userId,
                products: [{ product: productId, viewedAt: currentTimestamp }]
            });
        } else {
            const existingProductIndex = userRecent.products.findIndex((item: any) => item.product.toString() === productId);
            if (existingProductIndex !== -1) {
                userRecent.products[existingProductIndex].viewedAt = currentTimestamp;
            } else {
                userRecent.products.push({ product: productId, viewedAt: currentTimestamp });
            }
        }
        await userRecent.save();
        return NextResponse.json({ message: "Product added to recently viewed list" });
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating recently viewed list", error: error.message }, { status: 500 });
    }
}
