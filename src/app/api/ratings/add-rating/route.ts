import { connect } from "@/dbConfig/dbConfig";
import Rating from "@/models/ratingModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        
        const { productId, userId, rating } = await request.json();
        
        
        if (!productId || !userId || rating === undefined) {
            return NextResponse.json({ message: "productId, userId, and rating are required" }, { status: 400 });
        }

        let productRating = await Rating.findOne({ productId:productId });
        
        if (!productRating) {
            
            productRating = new Rating({ productId, ratings: [{ userId, rating }] });
        } else {
            
            const existingRating = productRating.ratings.find((r:any) => r.userId === userId);

            if (existingRating) {
                
                existingRating.rating = rating;
            } else {
               
                productRating.ratings.push({ userId, rating });
            }
        }

        
        await productRating.save();
        console.log(productRating);
        return NextResponse.json({ message: "Rating saved successfully", productRating });
    } catch (e: any) {
        console.error("Error saving rating:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
