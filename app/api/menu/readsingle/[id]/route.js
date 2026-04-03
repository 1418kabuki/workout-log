import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request,context){
  const params = await context.params
  const id = params.id
  try {
    const result = await prisma.workoutLog.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!result) {
      return NextResponse.json({message: "指定されたデータが見つかりませんでした。"})
    }

    return NextResponse.json({message: "メニュー読み取り成功（シングル）", data: result})
  } catch(err) {
    return NextResponse.json({message: `メニュー読み取り失敗（シングル）: ${err}`})
  }
}