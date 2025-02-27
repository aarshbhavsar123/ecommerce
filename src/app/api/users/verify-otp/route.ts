import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import nodemailer from "nodemailer";
import { useTheme } from "@emotion/react";
import bcryptjs from "bcryptjs";
connect();
export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { otp,email } = reqBody;
        const time = Date.now();
        const user = await User.findOne({email:email});
        const hashedOtp = user.otp;
        const userTime = user.lastOtpReq;
        const validOtp = await bcryptjs.compare(otp,hashedOtp);
        
        if (validOtp && time - userTime <= 120000) {
            await User.updateOne({email:email},{otp:"",lastOtpReq:""});
            console.log("OTP is valid within 2 minutes");
            return NextResponse.json({message:"success"});
        } else {
            if(time - userTime > 120000)
            {
                await User.updateOne({email:email},{otp:"",lastOtpReq:""});
                return NextResponse.json({ message: "error" }, { status: 400 });
            }
            if(!validOtp)
            {
                console.log("OTP is invalid");
                return NextResponse.json({ message: "error" }, { status: 400 });
            }
        }

        return NextResponse.json({message:"Done"});
    } catch (e) {
        
        console.error(e);
    }
}
