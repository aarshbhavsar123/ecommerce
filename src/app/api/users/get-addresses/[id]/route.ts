import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const user = await User.findById(userId);
    return NextResponse.json(user.addresses);
    
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
