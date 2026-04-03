import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, context) {
  const reqBody = await request.json()
  const {  exercise, weight, image, reps, memo, email } = reqBody
  const params = await context.params
  const targetId = params.id
  try {
    const workoutLog = await prisma.workoutLog.findFirst({
      where: {
        id: Number(targetId),
      },
    });

    if (!workoutLog) {
      return NextResponse.json({ message: "対象のデータが見つかりません" }, { status: 404 });
    }

    if (workoutLog.email === email) {
      const result = await prisma.workoutLog.delete({
        where: {
          id: Number(targetId),
        },
      });
      return NextResponse.json({ message: "メニュー削除成功", data: result })
    } else {
      return NextResponse.json({ message: "他の人が作成したアイテムです" })
    }
  } catch (err) {
    return NextResponse.json({ message: `メニュー削除失敗: ${err}` })
  }
}