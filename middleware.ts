import withAuth from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks : {
            authorized : ({token,req})=>{
               
                const pathname = req.nextUrl.pathname;

                //allow access to public and auth related routes 
                if(pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true;
                }

                if(pathname === "/" || pathname.startsWith("/api/video")){
                    return true;
                }

                return !!token;
            }
        }
    }
)


export const config = {
    matcher: ["/((?!_next|favicon.ico|public).*)"], 
}