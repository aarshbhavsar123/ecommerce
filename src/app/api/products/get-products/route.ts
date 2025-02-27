import {connect} from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try 
    {
        const resp = Product.find();
    
        return NextResponse.json(resp);
        
    } 
    catch(e: any) 
    {
        return NextResponse.json({message:"Error"},{status:404});
    }
}
