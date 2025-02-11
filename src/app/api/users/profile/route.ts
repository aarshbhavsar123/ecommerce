import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; 

connect();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value; // Extract token from cookies

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl)); // Redirect if no token
    }

    // Decode the JWT token to get userId
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: string };
    console.log(decoded);

    // Fetch user data from the database using the userId
    console.log(decoded);
    
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", req.nextUrl)); // Redirect if no user is found
    }
    
    
    return NextResponse.json(decoded);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", req.nextUrl)); // Redirect on error
  }
}

export const config = {
  matcher: ['/dashboard/*', '/profile/*'], // Apply to dashboard and profile routes
};
