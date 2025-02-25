import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) 
{
    const path = request.nextUrl.pathname
    const isPublic = path=="/login"||path=="/signup";
    const token = request.cookies.get("token")?.value||"";
    if(isPublic && token)
    {
        return NextResponse.redirect(new URL("/",request.nextUrl));
    }
    if(!isPublic && !token)
    {
        return NextResponse.redirect(new URL("/login",request.nextUrl));
    }
    const isForget = (path=="/forget-password"||path=="/forget-password-otp");
    if(isForget && token)
    {
      return NextResponse.redirect(new URL("/",request.nextUrl));
    }
}
 
export const config = {
  matcher:[
    "/",
    "/login",
    "/signup",
    "/forget-password",
    "/forget-password-otp"
  ]
}