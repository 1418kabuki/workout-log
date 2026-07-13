const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')
const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@workout.app'

const START_DATE = new Date(2026, 0, 1)  // 2026/1/1
const END_DATE = new Date(2026, 5, 30)   // 2026/6/30
const RECORD_DAYS = 70

const EXERCISES = ['ベンチプレス', 'スクワット', 'デッドリフト']
const WEIGHT_RANGE = {
  'ベンチプレス': { start: 50, end: 85 },
  'スクワット': { start: 60, end: 105 },
  'デッドリフト': { start: 70, end: 125 },
}

// シード付き疑似乱数（毎回 node seed.js を実行しても同じ結果になるように固定）
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20260101)

const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1))

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// RECORD_DAYS件の日付を START_DATE〜END_DATE からランダムに（重複なく）選ぶ
const buildDates = () => {
  const totalDays = Math.round((END_DATE - START_DATE) / 86400000) + 1
  const allOffsets = Array.from({ length: totalDays }, (_, i) => i)
  const chosen = shuffle(allOffsets).slice(0, RECORD_DAYS).sort((a, b) => a - b)
  return chosen.map(offset => {
    const d = new Date(START_DATE)
    d.setDate(d.getDate() + offset)
    return d
  })
}

async function main() {
  // デモユーザー作成（emailにunique制約が無いため upsert ではなく手動チェック）
  const existingUser = await prisma.user.findFirst({ where: { email: DEMO_EMAIL } })
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        password: 'demo',
        name: 'デモユーザー',
      }
    })
  }

  // 既存のデモデータをリセット（毎回固定のデータにするため）
  await prisma.workoutLog.deleteMany({ where: { email: DEMO_EMAIL } })

  const dates = buildDates()

  // 1日ごとに、その日にやる種目数（1〜3）とセット数（2〜4）をランダムに決める
  const daySessions = dates.map(date => {
    const exerciseCount = randInt(1, 3)
    const exercisesForDay = shuffle(EXERCISES).slice(0, exerciseCount)
    return {
      date,
      exercises: exercisesForDay.map(exercise => ({
        exercise,
        setCount: randInt(2, 4),
      })),
    }
  })

  // 種目ごとの総出現回数を数える（重量の進行度計算に使う）
  const totalOccurrences = { 'ベンチプレス': 0, 'スクワット': 0, 'デッドリフト': 0 }
  daySessions.forEach(day => {
    day.exercises.forEach(e => { totalOccurrences[e.exercise]++ })
  })
  const occurrenceIndex = { 'ベンチプレス': 0, 'スクワット': 0, 'デッドリフト': 0 }

  let totalRows = 0
  for (const day of daySessions) {
    const groupId = crypto.randomUUID()

    for (const { exercise, setCount } of day.exercises) {
      const total = totalOccurrences[exercise]
      const idx = occurrenceIndex[exercise]
      const progress = total > 1 ? idx / (total - 1) : 0

      const { start, end } = WEIGHT_RANGE[exercise]
      const baseWeight = Math.round((start + (end - start) * progress) / 2.5) * 2.5

      for (let s = 0; s < setCount; s++) {
        // セットが進むごとに重量は少し下がり、回数も少し減る（自然な感じに）
        const weight = Math.max(start, baseWeight - s * 2.5)
        const reps = Math.max(5, 10 - Math.round(progress * 4) - s)

        await prisma.workoutLog.create({
          data: {
            exercise,
            weight,
            reps,
            memo: '',
            email: DEMO_EMAIL,
            createdAt: new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), 12, 0, 0),
            groupId,
          }
        })
        totalRows++
      }

      occurrenceIndex[exercise]++
    }
  }

  console.log(`デモデータ注入完了！（${dates.length}日分・${totalRows}件、2026/1/1〜2026/6/30）`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
