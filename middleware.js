import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request){
    const token = await request.headers.get("Authorization")?.split(" ")[1]

    if(!token){
        return NextResponse.json({message: "トークンがありません"})
    }

    try{
        const secretKey = new TextEncoder().encode("workout-app")
        const decodedJwt = await jwtVerify(token, secretKey)
        return NextResponse.next()
    }catch{
        return NextResponse.json({message: "トークンが正しくないので、ログインしてください"})
    }
}

export const config = {
    matcher: ["/api/menu/create", "/api/menu/update/:path*", "/api/menu/delete/:path*"],
}
