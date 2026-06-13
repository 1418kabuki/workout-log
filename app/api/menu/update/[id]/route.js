import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'

export async function PUT(request, context) {
  const reqBody = await request.json()
  const { exercise, weight, image, reps, memo, email } = reqBody
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
      
      const result = await prisma.workoutLog.update({
        where: {
          id: Number(targetId),
        },
        data: {
          exercise: exercise,
          weight: parseFloat(weight), // 安全のためここでも変換
          reps: parseInt(reps),
          image: image,
          memo: memo,
          // email: "suzuki@ezweb.ne.jp",
        },
      });
      return NextResponse.json({ message: "メニュー編集成功", data: result })
    } else {
      return NextResponse.json({ message: "他の人が作成したアイテムです" })
    }
  } catch (err) {
    console.log("編集失敗の詳細:", err);
    return NextResponse.json({ message: `メニュー編集失敗: ${err.message}` })
  }
}