import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request){
    const reqBody = await request.json();
  try {
    const result = await prisma.user.create({
       data: reqBody
    });
    return NextResponse.json({message:"ユーザー登録成功", data: result});
  } catch (err) {
    return NextResponse.json({ error: `ユーザー登録失敗: ${err}`})
  }
}