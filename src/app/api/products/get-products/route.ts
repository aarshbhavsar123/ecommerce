import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const minPrice = parseFloat(searchParams.get("min") || "0");
        const maxPrice = parseFloat(searchParams.get("max") || "10000");

        // Parse selectedBrands array from the string
        let selectedBrands = searchParams.get("selectedBrands") || "[]";
        selectedBrands = JSON.parse(selectedBrands);

        // Construct the filter object
        const filter: any = {
            price: { $gte: minPrice, $lte: maxPrice },
        };

        if (selectedBrands.length > 0) {
            filter.brand = { $in: selectedBrands };
        }

        // Fetch products based on filters
        const products = await Product.find(filter);

        return NextResponse.json(products);
    } catch (e: any) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}
