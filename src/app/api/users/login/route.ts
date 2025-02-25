import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

connect();


export async function POST(request:NextRequest)
{
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
    try
    {
        const reqBody = await request.json();
        const {email,password} = reqBody;
        
        const user = await User.findOne({email});
        if(!user)
        {
            return NextResponse.json({error:"User does not exist"},{status:400});
        }
        else
        {
            const validPassword = await bcryptjs.compare(password,user.password);
            if(!validPassword)
            {
                return NextResponse.json({error:"Invalid Password"},{status:400});
            }
            else
            {
                
                const tokenData = {
                    id:user._id,
                    username:user.username,
                    email:user.email
                }
                
                const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"});
                const response = NextResponse.json({
                    message:"Login Successful",
                    success:true,

                })
                response.cookies.set("token",token,{httpOnly:true});
                transporter.verify(function (e,s){
                    if(e)
                    {
                        console.error("SMTP Connection Error:", e);
                    }
                    else{
                        console.log("ready");
                    }
                })
                await transporter.sendMail({
                    from: process.env.MAIL,
                    to: email,
                    subject: "Login Detected",
                    text: `Hello ${user.username}, Login to amazon detected. Plese take action if it was not you.`,
                });
                return response;
            }

        }
    }
    catch(e:any)
    {
        return NextResponse.json({e:e.message},{status:500});
    }
}
