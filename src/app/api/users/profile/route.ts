import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; 

connect();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl)); 
    }

   
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: string };
    
    
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    
    
    return NextResponse.json(decoded);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", req.nextUrl)); 
  }
}

export const config = {
  matcher: ['/dashboard/*', '/profile/*'],
};
