import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;  

        if (!id) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findById(id);
           
        if (!product) {

            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } 
    catch (e: any) {
        return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
    }
}
