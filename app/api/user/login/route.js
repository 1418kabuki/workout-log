import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(request) {
  const reqBody = await request.json();
  const { email, password } = reqBody;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      if (password === user.password) {

        const secretKey = new TextEncoder().encode("workout-app")
        const payload = { email: reqBody.email, }
        const token = await new SignJWT(payload) .setProtectedHeader({alg: "HS256"}) .setExpirationTime("1d") .sign(secretKey)

        return NextResponse.json({ message: "ログイン成功", token: token })
      } else {
        return NextResponse.json({ message: "ログイン失敗：パスワードが間違っています。" })
      }
    } else {
      return NextResponse.json({ message: "ユーザーが見つかりませんでした。" })
    }
  } catch {
    return NextResponse.json({ message: "ログイン失敗" })
  }
}