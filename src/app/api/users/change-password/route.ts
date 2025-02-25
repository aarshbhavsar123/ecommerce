import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const user = await User.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: "User doesn't exist" }, { status: 404 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save(); 
        return NextResponse.json({ message: "Password updated successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
