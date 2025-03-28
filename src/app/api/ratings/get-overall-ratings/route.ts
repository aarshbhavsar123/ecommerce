import { connect } from "@/dbConfig/dbConfig";
import Rating from "@/models/ratingModel";
import { NextRequest, NextResponse } from "next/server";

// Ensure database connection
connect();
export async function GET(request: NextRequest) {
    try {
        
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const rating = await Rating.findOne({productId:productId});
        const length = rating.ratings.length;
        let sum = 0;
        for(let i = 0;i<length;i++)
        {
            sum+=rating.ratings[i].rating;
        }
        const avg = sum/length;
        const obj = {
            avg:avg,
            length:length
        }

        return NextResponse.json(obj);
    } catch (error) {
        return NextResponse.json({message:"error"},{status:500})
    }
}