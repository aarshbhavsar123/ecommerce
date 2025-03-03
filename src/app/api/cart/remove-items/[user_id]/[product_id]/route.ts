import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartSchema";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

connect();

export async function POST(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const user_id = urlParts[urlParts.length - 2];
    const product_id = urlParts[urlParts.length - 1];

    // Ensure IDs are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(product_id)) {
      return NextResponse.json({ error: "Invalid user ID or product ID" }, { status: 400 });
    }
    const cartBefore = await Cart.findOne({ owner_id: user_id });
    

    if (!cartBefore) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { owner_id: user_id },
      { $pull: { products: { product: new mongoose.Types.ObjectId(product_id) } } }, // Ensure correct field
      { new: true }
    );    
    if (!updatedCart) {
      return NextResponse.json({ error: "Failed to remove product" }, { status: 500 });
    }

    return NextResponse.json({ message: "Product removed successfully", updatedCart });
  } catch (error: any) {
    console.error("Error removing product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
