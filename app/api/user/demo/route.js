import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export async function POST() {
    const secretKey = new TextEncoder().encode("workout-app")
    const token = await new SignJWT({ email: "demo@workout.app" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secretKey)

    return NextResponse.json({ token })
}
