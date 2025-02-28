import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const products = await Product.find(); 
        return NextResponse.json(products);
    } 
    catch (e: any) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}
