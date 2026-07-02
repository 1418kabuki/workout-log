"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CalendarView from "../components/calendar-view"

const RecordsPage = () => {
    const [grouped, setGrouped] = useState({})
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { router.push("/user/login"); return }

        fetch("/api/menu/readall", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(({ data }) => {
                if (!data) return
                const g = data.reduce((acc, record) => {
                    const d = new Date(record.createdAt)
                    const isoDate = [
                        d.getFullYear(),
                        String(d.getMonth() + 1).padStart(2, "0"),
                        String(d.getDate()).padStart(2, "0"),
                    ].join("-")
                    if (!acc[isoDate]) acc[isoDate] = {}
                    if (!acc[isoDate][record.exercise]) acc[isoDate][record.exercise] = []
                    acc[isoDate][record.exercise].push({
                        id: record.id,
                        weight: record.weight,
                        reps: record.reps,
                    })
                    return acc
                }, {})
                setGrouped(g)
            })
    }, [router])

    return (
        <div>
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: 0, color: "#333" }}>
                    記録
                </h1>
            </div>

            <CalendarView markedDates={Object.keys(grouped)} />

            {Object.keys(grouped).length > 0 ? (
                Object.entries(grouped).reverse().map(([isoDate, exercises]) => {
                    const exerciseCount = Object.keys(exercises).length
                    const setCount = Object.values(exercises).reduce((sum, sets) => sum + sets.length, 0)
                    const displayDate = new Date(`${isoDate}T12:00:00`).toLocaleDateString("ja-JP", {
                        year: "numeric", month: "long", day: "numeric", weekday: "short",
                    })

                    return (
                        <div key={isoDate} style={{ marginBottom: "2rem" }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1rem",
                            }}>
                                <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#555", margin: 0 }}>
                                    {displayDate}
                                </p>
                                <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: 0 }}>
                                    {exerciseCount}種目 · {setCount}セット
                                </p>
                            </div>

                            <Link
                                href={`/menu/edit-day/${isoDate}`}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.2rem",
                                    background: "white",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "1.5rem",
                                    padding: "1.8rem 2rem",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                    textDecoration: "none",
                                    color: "inherit",
                                    cursor: "pointer",
                                }}
                            >
                                {Object.entries(exercises).map(([exercise, sets], i, arr) => (
                                    <div
                                        key={exercise}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            paddingBottom: i < arr.length - 1 ? "1.2rem" : 0,
                                            borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none",
                                            gap: "1rem",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                                            <span style={{ fontSize: "1.6rem" }}>💪</span>
                                            <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: 0 }}>
                                                {exercise}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "flex-end" }}>
                                            {sets.map((set, j) => (
                                                <span
                                                    key={j}
                                                    style={{
                                                        fontSize: "1.3rem",
                                                        color: "#FF63A4",
                                                        fontWeight: "600",
                                                        background: "rgba(255,99,164,0.08)",
                                                        padding: "0.3rem 0.9rem",
                                                        borderRadius: "10rem",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {set.weight}kg×{set.reps}回
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Link>
                        </div>
                    )
                })
            ) : (
                <div style={{
                    textAlign: "center",
                    padding: "6rem 2rem",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "1.5rem",
                }}>
                    <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏋️</p>
                    <p style={{ fontSize: "1.6rem", color: "#9ca3af", margin: 0 }}>記録がありません</p>
                </div>
            )}
        </div>
    )
}

export default RecordsPage
