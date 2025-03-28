import { connect } from "@/dbConfig/dbConfig";
import Rating from "@/models/ratingModel";
import { NextRequest, NextResponse } from "next/server";

// Ensure database connection
connect();
export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productIds = searchParams.get('productIds');

        // Validate input
        if (!userId || !productIds) {
            return NextResponse.json({ 
                message: "Missing required query parameters",
                details: {
                    userId: !!userId,
                    productIds: !!productIds
                }
            }, { status: 400 });
        }

        // Convert productIds to array
        const productIdArray = productIds.split(',');

        // Find ratings for the specified products and user
        const ratings = await Rating.find({ 
            productId: { $in: productIdArray } 
        });

        // Process and extract user's ratings
        const userRatings = ratings.map((rating:any) => {
            const userRating = rating.ratings.find((r:any) => r.userId === userId);
            return userRating 
                ? { 
                    productId: rating.productId, 
                    rating: userRating.rating 
                }
                : null;
        }).filter(r => r !== null);

        return NextResponse.json(userRatings, { status: 200 });
    } catch (error) {
        console.error('Fetching ratings error:', error);
        return NextResponse.json({ 
            message: 'Internal server error', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}