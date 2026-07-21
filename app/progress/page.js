"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipboardList, Weight, Flame, Trophy } from "lucide-react"
import ExerciseSearch from "./exercise-search"

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
        <div style={{
            background: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "1.6rem",
            padding: "2.2rem",
            marginBottom: "3rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
            <h2 style={{ fontSize: "1.7rem", fontWeight: "700", color: "#222", margin: "0 0 1.6rem" }}>
                ワークアウト頻度
            </h2>
            <div style={{ display: "flex", gap: "0.3rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginRight: "0.6rem", paddingTop: "1.6rem", flexShrink: 0 }}>
                    {["", "月", "", "水", "", "金", ""].map((label, i) => (
                        <div key={i} style={{ width: "1.1rem", height: "1.1rem", fontSize: "0.9rem", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                            {label}
                        </div>
                    ))}
                </div>
                <div ref={scrollRef} style={{ overflowX: "auto" }}>
                    <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.4rem", height: "1.2rem", overflow: "hidden" }}>
                        {weeks.map((week, i) => (
                            <div key={i} style={{ width: "1.1rem", fontSize: "1rem", color: "#9ca3af", flexShrink: 0, whiteSpace: "nowrap" }}>
                                {week.monthLabel}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                        {weeks.map((week, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flexShrink: 0 }}>
                                {week.days.map((day, j) => (
                                    <div
                                        key={j}
                                        title={`${day.date.getMonth() + 1}/${day.date.getDate()}（${day.count}件）`}
                                        style={{
                                            width: "1.1rem",
                                            height: "1.1rem",
                                            borderRadius: "0.25rem",
                                            background: heatColors[day.level],
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.4rem", marginTop: "1.2rem", fontSize: "1.1rem", color: "#9ca3af" }}>
                <span>少ない</span>
                {heatColors.map((c, i) => (
                    <div key={i} style={{ width: "1.1rem", height: "1.1rem", borderRadius: "0.3rem", background: c }} />
                ))}
                <span>多い</span>
            </div>
        </div>
    )
}

const StatCard = ({ icon, color, label, value, unit }) => (
    <div style={{
        background: "white",
        border: "1px solid #f0f0f0",
        borderRadius: "1.4rem",
        padding: "1.6rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    }}>
        <div style={{
            width: "3.6rem",
            height: "3.6rem",
            borderRadius: "1.1rem",
            background: `${color}1f`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.2rem",
        }}>
            {icon}
        </div>
        <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0 0 0.4rem" }}>{label}</p>
        <p style={{ fontSize: "2.2rem", fontWeight: "700", color: "#333", margin: 0 }}>
            {value}
            <span style={{ fontSize: "1.3rem", fontWeight: "400", color: "#9ca3af" }}> {unit}</span>
        </p>
    </div>
)

const LineChart = ({ data }) => {
    if (data.length === 0) return (
        <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
            <p style={{ fontSize: "3rem" }}>📊</p>
            <p style={{ fontSize: "1.4rem", margin: 0 }}>記録が見つかりませんでした</p>
        </div>
    )

    const W = 360, H = 200
    const padL = 45, padR = 15, padT = 30, padB = 40
    const innerW = W - padL - padR
    const innerH = H - padT - padB

    const maxVal = Math.max(...data.map(d => d.weight))
    const minVal = Math.min(...data.map(d => d.weight))
    const yMax = Math.ceil(maxVal / 10) * 10 + 10
    const yMin = Math.max(Math.floor(minVal / 10) * 10 - 10, 0)
    const yRange = yMax - yMin
    const yTicks = [0, 0.25, 0.5, 0.75, 1]

    const toX = (i) => padL + (innerW / Math.max(data.length - 1, 1)) * i
    const toY = (w) => padT + innerH * (1 - (w - yMin) / yRange)

    const points = data.map((d, i) => `${toX(i)},${toY(d.weight)}`).join(" ")

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF63A4" />
                    <stop offset="100%" stopColor="#FFD873" />
                </linearGradient>
            </defs>

            {yTicks.map(t => {
                const y = padT + innerH * (1 - t)
                return (
                    <g key={t}>
                        <line x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                            {Math.round(yMin + yRange * t)}
                        </text>
                    </g>
                )
            })}

            <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#e5e7eb" strokeWidth="1" />
            <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="#e5e7eb" strokeWidth="1" />

            <polyline points={points} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

            {data.map((d, i) => {
                const x = toX(i)
                const y = toY(d.weight)
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="white" stroke="#FF63A4" strokeWidth="2" />
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fill="#FF63A4" fontWeight="700">
                            {d.weight}
                        </text>
                        <text x={x} y={H - padB + 15} textAnchor="middle" fontSize="9" fill="#9ca3af">
                            {d.date}
                        </text>
                    </g>
                )
            })}
        </svg>
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
            <h1 style={{ fontSize: "2.6rem", fontWeight: "700", margin: "0 0 3rem", color: "#222" }}>
                成長
            </h1>

            {stats && stats.totalSessions > 0 && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
                    gap: "1.2rem",
                    marginBottom: "3rem",
                }}>
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

            <div style={{
                background: "white",
                borderRadius: "2rem",
                padding: "2rem",
                marginBottom: "3rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                border: "1px solid #f0f0f0",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                }}>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: 0, whiteSpace: "nowrap" }}>
                        {exercise ? `${exercise} の月平均重量推移（kg）` : "種目の成長"}
                    </h2>
                    <ExerciseSearch defaultValue={exercise} />
                </div>
                {exercise ? (
                    <LineChart data={chartData} />
                ) : (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
                        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</p>
                        <p style={{ fontSize: "1.4rem", margin: 0 }}>種目名を入力してグラフを表示</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const ProgressPage = () => (
    <Suspense>
        <ProgressContent />
    </Suspense>
)

export default ProgressPage
