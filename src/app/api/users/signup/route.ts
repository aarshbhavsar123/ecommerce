import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect();


export async function POST(request:NextRequest)
{
    try
    {
        const {username,password,email,isAdmin} = await request.json();
        const user = await User.findOne({email:email});
        if(user)
        {
            console.log("User already exists");
            return NextResponse.json({error:"User already exists"},{status:400});
        }
        
        else
        {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password,salt);
            console.log(isAdmin);
            const newUser = new User({
                username:username,email:email,password:hashedPassword,isAdmin:isAdmin 
            })
            const savedUser = await newUser.save();
            
            return NextResponse.json({message:"User created successfully",success:true,savedUser:savedUser});
        }
        
    }
    catch(e:any)
    {
        return NextResponse.json({e:e.message},{status:500});
    }
}
