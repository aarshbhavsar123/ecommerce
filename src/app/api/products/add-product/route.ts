import {connect} from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try 
    {
        const reqBody = await request.json();
        const {product_name,seller_id,price,images,description} = reqBody;
        
        const savedProduct = await Product.create({
            product_name,
            seller_id,
            price,
            images,
            description
          });
          console.log(savedProduct);
        return NextResponse.json({message:"completed"});
    } 
    catch(e: any) 
    {
        return NextResponse.json({message:"Error"},{status:400});
    }
}
