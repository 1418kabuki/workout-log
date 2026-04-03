import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request){
  try {
    const reqBody = await request.json();

    const result = await prisma.workoutLog.create({
       data: {
        exercise: reqBody.exercise,
        weight: Number(reqBody.weight), 
        reps: Number(reqBody.reps),
        image: reqBody.image,
        memo: reqBody.memo,
        email: "test@example.com"
       }
    });
    return NextResponse.json({message:"メニュー作成成功", data: result});
  } catch (err) {
    return NextResponse.json({ error: `メニュー作成失敗: ${err}`})
  }
}