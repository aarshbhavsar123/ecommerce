import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartSchema";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ owner_id: userId }).populate("products.product"); // Ensure "products.product" is populated

    if (!cart) {
      return NextResponse.json({ cart: { products: [] } });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
