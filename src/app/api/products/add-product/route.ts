import {connect} from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try 
    {
        const reqBody = await request.json();
        const {product_name,seller_id,price,images} = reqBody;
        const newProduct = new Product({product_name:product_name,seller_id:seller_id,price:price,images:images});
        console.log(newProduct);
        const savedProduct = await newProduct.save();
        
        return NextResponse.json({message:"completed"});
    } 
    catch(e: any) 
    {
        return NextResponse.json({message:"Error"},{status:400});
    }
}
