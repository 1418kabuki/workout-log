const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@workout.app'

async function main() {
  // デモユーザー作成
  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      password: 'demo',
      name: 'デモユーザー',
    }
  })

  // デモ用筋トレデータ（過去6ヶ月分）
  const now = new Date()
  const demoLogs = [
    { exercise: 'ベンチプレス', weight: 60, reps: 10, memo: '', monthsAgo: 5 },
    { exercise: 'ベンチプレス', weight: 65, reps: 8,  memo: '', monthsAgo: 4 },
    { exercise: 'ベンチプレス', weight: 65, reps: 10, memo: '', monthsAgo: 3 },
    { exercise: 'ベンチプレス', weight: 70, reps: 8,  memo: '', monthsAgo: 2 },
    { exercise: 'ベンチプレス', weight: 72, reps: 8,  memo: '', monthsAgo: 1 },
    { exercise: 'ベンチプレス', weight: 75, reps: 6,  memo: '', monthsAgo: 0 },
    { exercise: 'スクワット',   weight: 80, reps: 10, memo: '', monthsAgo: 5 },
    { exercise: 'スクワット',   weight: 85, reps: 10, memo: '', monthsAgo: 3 },
    { exercise: 'スクワット',   weight: 90, reps: 8,  memo: '', monthsAgo: 1 },
    { exercise: 'デッドリフト', weight: 100, reps: 5, memo: '', monthsAgo: 4 },
    { exercise: 'デッドリフト', weight: 105, reps: 5, memo: '', monthsAgo: 2 },
    { exercise: 'デッドリフト', weight: 110, reps: 5, memo: '', monthsAgo: 0 },
  ]

  for (const log of demoLogs) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - log.monthsAgo)
    await prisma.workoutLog.create({
      data: {
        exercise: log.exercise,
        weight: log.weight,
        reps: log.reps,
        memo: log.memo,
        email: DEMO_EMAIL,
        createdAt: date,
      }
    })
  }

  console.log('デモデータ注入完了！')
}

main().catch(console.error).finally(() => prisma.$disconnect())
