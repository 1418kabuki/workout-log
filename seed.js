const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.workoutLog.createMany({
    data: [
      { exercise: 'ベンチプレス', weight: 60.0, reps: 10, memo: '本気の一歩目' },
      { exercise: '懸垂', weight: 0.0, reps: 8, memo: '背中で引く' }
    ]
  })
  console.log('データ注入完了！')
}

main().catch(console.error).finally(() => prisma.$disconnect())