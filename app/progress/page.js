"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipboardList, Weight, Flame, Trophy } from "lucide-react"
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import ExerciseSearch from "./exercise-search"
import { Card } from "@/components/ui/card"

const buildChartData = (records) => {
    const monthMap = {}
    records.forEach(r => {
        const d = new Date(r.createdAt)
        const key = `${d.getFullYear()}/${d.getMonth() + 1}`
        if (!monthMap[key]) monthMap[key] = []
        monthMap[key].push(r.weight)
    })
    return Object.entries(monthMap).map(([month, weights]) => ({
        date: month,
        weight: Math.round(weights.reduce((a, b) => a + b, 0) / weights.length),
        count: weights.length,
    }))
}

const dateKey = (value) => {
    const d = new Date(value)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const buildStats = (records) => {
    if (!records.length) return { totalSessions: 0, totalVolume: 0, streak: 0, best: null }

    const totalVolume = records.reduce((sum, r) => sum + r.weight * r.reps, 0)

    const uniqueDays = [...new Set(records.map(r => dateKey(r.createdAt)))]
        .map(key => {
            const [y, m, d] = key.split("-").map(Number)
            return new Date(y, m, d)
        })
        .sort((a, b) => a - b)

    const totalSessions = uniqueDays.length

    // 記録データ全体の中で最長の連続記録日数を求める
    let streak = 1
    let longestStreak = 1
    for (let i = 1; i < uniqueDays.length; i++) {
        const diffDays = Math.round((uniqueDays[i] - uniqueDays[i - 1]) / 86400000)
        streak = diffDays === 1 ? streak + 1 : 1
        longestStreak = Math.max(longestStreak, streak)
    }

    const best = records.reduce((max, r) => (!max || r.weight > max.weight) ? r : max, null)

    return { totalSessions, totalVolume, streak: longestStreak, best }
}

const HEATMAP_DAYS = 371
const heatColors = ["#f0f0f0", "rgba(255,99,164,0.28)", "rgba(255,99,164,0.52)", "rgba(255,99,164,0.76)", "#FF63A4"]
const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

const levelFor = (count) => {
    if (!count) return 0
    if (count <= 5) return 1
    if (count <= 10) return 2
    if (count <= 15) return 3
    return 4
}

const buildHeatmapWeeks = (records) => {
    const counts = {}
    records.forEach(r => {
        const key = dateKey(r.createdAt)
        counts[key] = (counts[key] || 0) + 1
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - (HEATMAP_DAYS - 1))
    start.setDate(start.getDate() - start.getDay()) // 日曜始まりに揃える

    // 今日までの日数分だけ生成する（未来のマスは作らない）
    const totalDays = Math.round((today - start) / 86400000) + 1
    const days = []
    const cursor = new Date(start)
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(cursor)
        const count = counts[dateKey(date)] || 0
        days.push({ date, count, level: levelFor(count) })
        cursor.setDate(cursor.getDate() + 1)
    }

    const weeks = []
    let lastMonth = -1
    for (let i = 0; i < days.length; i += 7) {
        const weekDays = days.slice(i, i + 7)
        let monthLabel = ""
        if (weekDays[0].date.getMonth() !== lastMonth) {
            monthLabel = monthNames[weekDays[0].date.getMonth()]
            lastMonth = weekDays[0].date.getMonth()
        }
        weeks.push({ monthLabel, days: weekDays })
    }

    return weeks
}

const Heatmap = ({ records }) => {
    const weeks = buildHeatmapWeeks(records)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [weeks.length])

    return (
        <Card className="mb-[3rem] gap-0 rounded-[1.6rem] p-[2.2rem] shadow-md ring-0">
            <h2 className="mb-[1.6rem] text-[1.7rem] font-bold text-foreground">
                ワークアウト頻度
            </h2>
            <div className="flex gap-[0.3rem]">
                <div className="mr-[0.6rem] flex shrink-0 flex-col gap-[0.3rem] pt-[1.6rem]">
                    {["", "月", "", "水", "", "金", ""].map((label, i) => (
                        <div key={i} className="flex h-[1.1rem] w-[1.1rem] items-center text-[0.9rem] text-[#9ca3af]">
                            {label}
                        </div>
                    ))}
                </div>
                <div ref={scrollRef} className="overflow-x-auto">
                    <div className="mb-[0.4rem] flex h-[1.2rem] gap-[0.3rem] overflow-hidden">
                        {weeks.map((week, i) => (
                            <div key={i} className="w-[1.1rem] shrink-0 whitespace-nowrap text-[1rem] text-[#9ca3af]">
                                {week.monthLabel}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-[0.3rem]">
                        {weeks.map((week, i) => (
                            <div key={i} className="flex shrink-0 flex-col gap-[0.3rem]">
                                {week.days.map((day, j) => (
                                    <div
                                        key={j}
                                        title={`${day.date.getMonth() + 1}/${day.date.getDate()}（${day.count}件）`}
                                        className="size-[1.1rem] rounded-[0.25rem]"
                                        style={{ background: heatColors[day.level] }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-[1.2rem] flex items-center justify-end gap-[0.4rem] text-[1.1rem] text-[#9ca3af]">
                <span>少ない</span>
                {heatColors.map((c, i) => (
                    <div key={i} className="size-[1.1rem] rounded-[0.3rem]" style={{ background: c }} />
                ))}
                <span>多い</span>
            </div>
        </Card>
    )
}

const StatCard = ({ icon, color, label, value, unit }) => (
    <Card className="gap-0 rounded-[1.4rem] p-[1.6rem] shadow-md ring-0">
        <div className="mb-[1.2rem] flex size-[3.6rem] items-center justify-center rounded-[1.1rem]" style={{ background: `${color}1f` }}>
            {icon}
        </div>
        <p className="mb-[0.4rem] text-[1.2rem] text-[#383c42]">{label}</p>
        <p className="text-[2.2rem] font-bold text-foreground">
            {value}
            <span className="text-[1.3rem] font-normal text-[#9ca3af]"> {unit}</span>
        </p>
    </Card>
)

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const { weight, count } = payload[0].payload
    return (
        <div className="rounded-[1rem] border border-border bg-card px-[1.4rem] py-[1rem] shadow-lg">
            <p className="mb-[0.3rem] text-[1.1rem] text-muted-foreground">{label}</p>
            <p className="text-[1.5rem] font-bold text-foreground">
                {weight}
                <span className="ml-[0.3rem] text-[1.1rem] font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[1rem] text-muted-foreground">{count}件の平均</p>
        </div>
    )
}

const NICE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100]

const pickStep = (range) => {
    const rough = range / 4
    return NICE_STEPS.find(s => s >= rough) ?? NICE_STEPS[NICE_STEPS.length - 1]
}

const MIN_MONTH_WIDTH = 64

const WeightChart = ({ data }) => {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [data.length])

    if (data.length === 0) return (
        <div className="py-[4rem] text-center text-[#9ca3af]">
            <p className="text-[3rem]">📊</p>
            <p className="text-[1.4rem]">記録が見つかりませんでした</p>
        </div>
    )

    const weights = data.map(d => d.weight)
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)
    const step = pickStep(maxWeight - minWeight)

    let yMin = Math.max(Math.floor(minWeight / step) * step, 0)
    let yMax = Math.ceil(maxWeight / step) * step
    if (yMin === yMax) {
        yMax += step
        yMin = Math.max(yMin - step, 0)
    }
    const yTicks = []
    for (let t = yMin; t <= yMax; t += step) yTicks.push(t)

    return (
        <div ref={scrollRef} className="overflow-x-auto">
            <div style={{ width: "100%", minWidth: `${data.length * MIN_MONTH_WIDTH}px` }}>
                <ResponsiveContainer width="100%" height={240}>
                    <RechartsLineChart data={data} margin={{ top: 20, right: 12, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "var(--chart-5)" }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "var(--chart-5)" }}
                            axisLine={false}
                            tickLine={false}
                            width={64}
                            tickMargin={16}
                            domain={[yMin, yMax]}
                            ticks={yTicks}
                            interval={0}
                            tickFormatter={(v) => `${v}kg`}
                        />
                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="var(--primary)"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "var(--card)", stroke: "var(--primary)", strokeWidth: 2 }}
                            activeDot={{ r: 7, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
                        />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

const ProgressContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const exercise = searchParams.get("exercise") || ""
    const [chartData, setChartData] = useState([])
    const [stats, setStats] = useState(null)
    const [allRecords, setAllRecords] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { router.push("/user/login"); return }
        if (!exercise) { setChartData([]); return }

        fetch(`/api/menu/readall?exercise=${encodeURIComponent(exercise)}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(({ data }) => {
                if (!data) return
                setChartData(buildChartData(data))
            })
    }, [exercise, router])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        fetch(`/api/menu/readall`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(({ data }) => {
                if (!data) return
                setStats(buildStats(data))
                setAllRecords(data)
            })
    }, [])

    return (
        <div>
            <h1 className="mb-[3rem] text-[2.6rem] font-bold text-foreground">
                成長
            </h1>

            {stats && stats.totalSessions > 0 && (
                <div className="mb-[3rem] grid gap-[1.2rem]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
                    <StatCard
                        icon={<ClipboardList size={18} color="#4FC3F7" />}
                        color="#4FC3F7"
                        label="総トレーニング回数"
                        value={stats.totalSessions}
                        unit="回"
                    />
                    <StatCard
                        icon={<Weight size={18} color="#FF63A4" />}
                        color="#FF63A4"
                        label="総ボリューム"
                        value={(stats.totalVolume / 1000).toFixed(1)}
                        unit="t"
                    />
                    <StatCard
                        icon={<Flame size={18} color="#E8A400" />}
                        color="#FFD873"
                        label="最長連続記録日数"
                        value={stats.streak}
                        unit="日"
                    />
                    <StatCard
                        icon={<Trophy size={18} color="#34D399" />}
                        color="#34D399"
                        label={`自己ベスト（${stats.best.exercise}）`}
                        value={stats.best.weight}
                        unit="kg"
                    />
                </div>
            )}

            {allRecords.length > 0 && <Heatmap records={allRecords} />}

            <Card className="mb-[3rem] gap-0 rounded-[2rem] p-[2rem] shadow-md ring-0">
                <div className="mb-[1.5rem] flex flex-wrap items-center justify-between gap-[1.5rem]">
                    <h2 className="whitespace-nowrap text-[1.6rem] font-bold text-foreground">
                        {exercise ? `${exercise} の月平均重量推移（kg）` : "種目の成長"}
                    </h2>
                    <ExerciseSearch defaultValue={exercise} />
                </div>
                {exercise ? (
                    <WeightChart data={chartData} />
                ) : (
                    <div className="py-[4rem] text-center text-[#9ca3af]">
                        <p className="mb-[1rem] text-[3rem]">📊</p>
                        <p className="text-[1.4rem]">種目名を入力してグラフを表示</p>
                    </div>
                )}
            </Card>
        </div>
    )
}

const ProgressPage = () => (
    <Suspense>
        <ProgressContent />
    </Suspense>
)

export default ProgressPage
