import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import nodemailer from "nodemailer";
import { useTheme } from "@emotion/react";
import bcryptjs from "bcryptjs";
connect();


const randomGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};

export async function POST(req: NextRequest) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port:465,
        secure:true,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD,
        },
        tls:{
            rejectUnauthorized:false,
        }
    });
    
    try {
        
        
        const reqBody = await req.json();
        const { email } = reqBody;
        
        
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        const otp = randomGenerator();
        transporter.verify(function (e,s){
            if(e)
            {
                console.error("SMTP Connection Error:", e);
            }
            else{
                console.log("ready");
            }
        })
        const info = await transporter.sendMail({
            from: process.env.MAIL,
            to: email,
            subject: "OTP to change the password",
            text: `OTP to change the password: ${otp}`,
        });
        const salt = await bcryptjs.genSalt(10);
        const hashedOTP = await bcryptjs.hash(String(otp), salt);

        await User.updateOne(
            { email: email },
            { 
                $set: { 
                    lastOtpReq: Date.now(),
                    otp: hashedOTP,
                } 
            }
        );
        
        return NextResponse.json({ message:"Successfully sent the otp to mail" });
    } catch (e) {
        
        return NextResponse.json({ error: "Failed to send mail" }, { status: 500 });
    }
}
