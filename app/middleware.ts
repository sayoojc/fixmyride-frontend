// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const accessToken = req.cookies.get("accessToken");
//   const refreshToken = req.cookies.get("refreshToken");

//   if (accessToken) {
//     console.log('The accesstoken exists')
//     return NextResponse.next();
//   }

//   if (refreshToken) {
//         console.log('The refreshtoken exists')
//     const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
//       method: "POST",
//       credentials: "include",
//     });

//     if (res.ok) {
    
//       return NextResponse.next();
//     } else {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.redirect(new URL("/login", req.url));
// }
