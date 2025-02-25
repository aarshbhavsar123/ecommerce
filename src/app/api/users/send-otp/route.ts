import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import nodemailer from "nodemailer";
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
    console.log(process.env.PASSWORD);
    try {
        
        
        const reqBody = await req.json();
        const { email } = reqBody;
        console.log(process.env.MAIL);
        console.log(email);
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
        
        console.log("Email sent:", info.response);
        return NextResponse.json({ otp });
    } catch (e) {
        
        return NextResponse.json({ error: "Failed to send mail" }, { status: 500 });
    }
}
