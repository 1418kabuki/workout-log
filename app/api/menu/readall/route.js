import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'

export async function GET(){
  try {
    const result = await prisma.workoutLog.findMany();
    return NextResponse.json({message: "メニュー読み取り成功（オール）", data: result})
  } catch(err) {
    return NextResponse.json({message: `メニュー読み取り失敗（オール）: ${err}`})  
  }
}

export const revalidate = 0