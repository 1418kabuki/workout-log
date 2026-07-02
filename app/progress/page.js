"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

    return (
        <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 2.5rem", color: "#333" }}>
                成長
            </h1>

            <div style={{ marginBottom: "2rem" }}>
                <ExerciseSearch defaultValue={exercise} />
            </div>

            <div style={{
                background: "white",
                borderRadius: "2rem",
                padding: "2rem",
                marginBottom: "3rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                border: "1px solid #f0f0f0",
            }}>
                {exercise ? (
                    <>
                        <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: "0 0 1.5rem" }}>
                            {exercise} の月平均重量推移（kg）
                        </h2>
                        <LineChart data={chartData} />
                    </>
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
