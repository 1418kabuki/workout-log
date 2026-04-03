import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function Home() {
  async function createWorkout(formData: FormData) {
    'use server'
    const exercise = formData.get('exercise') as string
    const weight = Number(formData.get('weight'))
    const reps = Number(formData.get('reps'))

    // 【ここが本番！】DBに保存する
    await prisma.workoutLog.create({
      data: {
        exercise,
        weight,
        reps,
      },
    })

    console.log("DBに保存が完了しました！")
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>💪 筋トレ記録くん</h1>
      <form action={createWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input name="exercise" placeholder="種目名（例：ベンチプレス）" required />
        <input name="weight" type="number" placeholder="重量 (kg)" required />
        <input name="reps" type="number" placeholder="回数" required />
        <button type="submit">記録を保存する</button>
      </form>
    </main>
  )
}