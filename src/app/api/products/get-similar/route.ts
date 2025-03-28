import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Recent from "@/models/recentlyViewed";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit") || "8");

        if (!userId) {
            return NextResponse.json(
                { message: "userId is required" },
                { status: 400 }
            );
        }

        // Step 1: Get the user's recently viewed products
        const recentlyViewed = await Recent.findOne({ userId });
        
        if (!recentlyViewed || !recentlyViewed.products || recentlyViewed.products.length === 0) {
            const trendingProducts = await Product.find({})
                .sort({ createdAt: -1 })
                .limit(limit);
            
            return NextResponse.json({ 
                products: trendingProducts,
                source: "trending",
                message: "No recently viewed products found"
            });
        }

        const recentProductIds = [];
        for (let i = 0; i < Math.min(3, recentlyViewed.products.length); i++) {
            recentProductIds.push(recentlyViewed.products[i].product);
        }

        const recentProducts = await Product.find({ _id: { $in: recentProductIds } });

        const allTags = [];
        for (let product of recentProducts) {
            if (product.tags) {
                for (let tag of product.tags) {
                    allTags.push(tag);
                }
            }
        }

        if (allTags.length === 0) {
            const trendingProducts = await Product.find({ _id: { $nin: recentProductIds } })
                .sort({ createdAt: -1 })
                .limit(limit);
            
            return NextResponse.json({
                products: trendingProducts,
                source: "trending",
                message: "No tags found in recently viewed products"
            });
        }

        let recommendedProducts = await Product.find({
            _id: { $nin: recentProductIds },
            tags: { $in: allTags }
        });

        const filteredRecommendations = [];
        for (let product of recommendedProducts) {
            let matchingTagsCount = 0;
            for (let tag of product.tags) {
                if (allTags.includes(tag)) matchingTagsCount++;
            }
            if (matchingTagsCount >= 2) {
                product = { ...product.toObject(), matchingTagsCount };
                filteredRecommendations.push(product);
            }
        }

        filteredRecommendations.sort((a, b) => b.matchingTagsCount - a.matchingTagsCount || b.createdAt - a.createdAt);
        recommendedProducts = filteredRecommendations.slice(0, limit);

        if (recommendedProducts.length < limit) {
            const additionalNeeded = limit - recommendedProducts.length;
            const excludeIds = [...recentProductIds, ...recommendedProducts.map(p => p._id)];

            let additionalProducts = await Product.find({
                _id: { $nin: excludeIds },
                tags: { $in: allTags }
            });

            const additionalFiltered = [];
            for (let product of additionalProducts) {
                let matchingTagsCount = 0;
                for (let tag of product.tags) {
                    if (allTags.includes(tag)) matchingTagsCount++;
                }
                if (matchingTagsCount === 1) {
                    additionalFiltered.push(product.toObject());
                }
            }

            additionalFiltered.sort((a, b) => b.createdAt - a.createdAt);
            recommendedProducts.push(...additionalFiltered.slice(0, additionalNeeded));
        }

        if (recommendedProducts.length < limit) {
            const finalNeeded = limit - recommendedProducts.length;
            const allExcludeIds = [
                ...recentProductIds,
                ...recommendedProducts.map(p => p._id)
            ];

            const newestProducts = await Product.find({ _id: { $nin: allExcludeIds } })
                .sort({ createdAt: -1 })
                .limit(finalNeeded);

            recommendedProducts.push(...newestProducts);
        }

        return NextResponse.json({
            products: recommendedProducts,
            source: "tag-based",
            recentlyViewedCount: recentProductIds.length,
            sourceTags: allTags
        });
    } catch (error:any) {
        console.error("Error fetching recommended products:", error);
        return NextResponse.json(
            { message: "Error fetching recommended products", error: error.message },
            { status: 500 }
        );
    }
}
