import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(){
  try {
    const result = await prisma.workoutLog.findMany();
    return NextResponse.json({message: "メニュー読み取り成功（オール）", data: result})
  } catch(err) {
    return NextResponse.json({message: `メニュー読み取り失敗（オール）: ${err}`})  
  }
}

export const revalidate = 0