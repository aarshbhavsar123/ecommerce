import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const minPrice = parseFloat(searchParams.get("min") || "0");
        const maxPrice = parseFloat(searchParams.get("max") || "10000");
        const order = searchParams.get("order") || "";
        let selectedBrands = searchParams.get("selectedBrands") || "[]";
        selectedBrands = JSON.parse(selectedBrands);

        // Pagination parameters
        const page = parseInt(searchParams.get("page") || "1");
        const productsPerPage = parseInt(searchParams.get("productsPerPage") || "10");
        const skip = (page - 1) * productsPerPage; // Calculate number of documents to skip

        const filter: any = {
            price: { $gte: minPrice, $lte: maxPrice },
        };

        if (selectedBrands.length > 0) {
            filter.brand = { $in: selectedBrands };
        }

        const sortOrder = order === "asc" ? 1 : -1;

        const products = await Product.aggregate([
            { $match: filter },
            { 
                $addFields: { 
                    capitalizedName: { $toUpper: "$product_name" } 
                } 
            },
            { $sort: { capitalizedName: sortOrder } },
            { $skip: skip },  // Skip documents based on pagination
            { $limit: productsPerPage },  // Limit results per page
        ]);

        // Count total products (for pagination UI)
        const totalProducts = await Product.countDocuments(filter);

        return NextResponse.json({ products, totalProducts });
    } catch (e: any) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}
        