import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const minPrice = parseFloat(searchParams.get("min") || "0");
        const maxPrice = parseFloat(searchParams.get("max") || "1000");

        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        return NextResponse.json(products);
    } 
    catch (e: any) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}
