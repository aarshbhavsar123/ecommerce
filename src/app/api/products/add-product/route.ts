import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { product_name, seller_id, price, images, description, brand } = reqBody;

        // Validate inputs
        if (!product_name || !seller_id || !price || !Array.isArray(images) || images.length === 0 || !description) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const savedProduct = await Product.create({
            product_name,
            seller_id,
            price,
            images,
            description,
            brand
        });

        return NextResponse.json({ message: "Product created successfully", product: savedProduct });
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating product", error: error.message }, { status: 500 });
    }
}
