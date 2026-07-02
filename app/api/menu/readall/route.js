import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import prisma from '@/lib/prisma'

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = authHeader?.replace("Bearer ", "")

        if (!token) {
            return NextResponse.json({ message: "認証エラー" }, { status: 401 })
        }

        const secretKey = new TextEncoder().encode("workout-app")
        const { payload } = await jwtVerify(token, secretKey)
        const email = payload.email

        const { searchParams } = new URL(request.url)
        const exercise = searchParams.get("exercise")

        const where = exercise
            ? { email, exercise }
            : { email }

        const result = await prisma.workoutLog.findMany({
            where,
            orderBy: { createdAt: "asc" },
        })

        return NextResponse.json({ message: "メニュー読み取り成功（オール）", data: result })
    } catch (err) {
        return NextResponse.json({ message: `メニュー読み取り失敗（オール）: ${err}` })
    }
}

export const revalidate = 0
