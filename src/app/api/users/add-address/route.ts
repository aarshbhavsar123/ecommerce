import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { userId, address } = await request.json();
        
        // Ensure both userId and address are provided
        if (!userId || !address) {
            return NextResponse.json({ message: "userId and address are required" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { addresses: address } }, 
            { new: true } 
        );
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        // console.log(user);
        return NextResponse.json({ message: "Address added successfully", user });
    } catch (e: any) {
        console.error("Error updating user:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
