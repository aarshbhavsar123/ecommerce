import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Recent from "@/models/recentlyViewed";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const currentPage = searchParams.get("currentPage");

        if (!userId || !currentPage) {
            return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
        }

        const recent = await Recent.findOne({ userId: userId });

        if (!recent || !recent.products || recent.products.length === 0) {
            return NextResponse.json({ message: "No recent products found" }, { status: 404 });
        }

        const currentTime = new Date();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

        
        const filteredProducts = recent.products.filter((product: any) => {
            if (!product.viewedAt) return false;
            const viewedAt = new Date(product.viewedAt);
            if (isNaN(viewedAt.getTime())) return false;
            return (currentTime.getTime() - viewedAt.getTime()) <= twoDaysInMs;
        });

        
        const productIds = [...new Set(filteredProducts.map((p: any) => p.product))];

       
        const productsDetails = await Product.find({ _id: { $in: productIds } }).limit(10);

        return NextResponse.json({ message: "Success!!", products: productsDetails });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
