"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import CalendarView from "../components/calendar-view"
import { allExercises, muscleImages } from "../exercises/page"

const getMuscleImage = (exerciseName) => {
    const found = allExercises.find(ex => ex.name === exerciseName)
    return found ? muscleImages[found.category] : null
}

const VISIBLE_COUNT = 5

const RecordsPage = () => {
    const [grouped, setGrouped] = useState({})
    const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT)
    const sentinelRef = useRef(null)
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

    const entries = Object.entries(grouped).reverse()
    const visibleEntries = entries.slice(0, visibleCount)
    const hasMore = visibleCount < entries.length

    // 一番下のsentinelが画面に入ったら、表示件数を増やす（インフィニットローディング）
    useEffect(() => {
        if (!hasMore || !sentinelRef.current) return
        const node = sentinelRef.current
        const observer = new IntersectionObserver((observerEntries) => {
            if (observerEntries[0].isIntersecting) {
                setVisibleCount(prev => prev + VISIBLE_COUNT)
            }
        }, { rootMargin: "300px" })
        observer.observe(node)
        return () => observer.disconnect()
    }, [hasMore])

    return (
        <div>
            <div style={{ marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "2.6rem", fontWeight: "700", margin: 0, color: "#222" }}>
                    記録
                </h1>
            </div>

            <CalendarView markedDates={Object.keys(grouped)} />

            <Link
                href="/menu/create"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    width: "100%",
                    padding: "1.4rem",
                    marginBottom: "3rem",
                    background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                    color: "white",
                    borderRadius: "1.2rem",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(255,99,164,0.25)",
                }}
            >
                <Plus size={19} strokeWidth={2.5} />
                記録を追加
            </Link>

            {entries.length > 0 ? (
                <>
                    {visibleEntries.map(([isoDate, exercises]) => {
                        const exerciseCount = Object.keys(exercises).length
                        const setCount = Object.values(exercises).reduce((sum, sets) => sum + sets.length, 0)
                        const displayDate = new Date(`${isoDate}T12:00:00`).toLocaleDateString("ja-JP", {
                            year: "numeric", month: "long", day: "numeric", weekday: "short",
                        })

                        return (
                            <div key={isoDate} style={{ marginBottom: "2.2rem" }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1.1rem",
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
                                    borderRadius: "1.6rem",
                                    padding: "1.8rem 2rem",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
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
                                        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexShrink: 0 }}>
                                            <div style={{
                                                width: "4.8rem",
                                                height: "4.8rem",
                                                borderRadius: "1.3rem",
                                                background: "linear-gradient(135deg, rgba(255,99,164,0.12), rgba(255,216,115,0.12))",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1.4rem",
                                                flexShrink: 0,
                                                overflow: "hidden",
                                            }}>
                                                {getMuscleImage(exercise) ? (
                                                    <img
                                                        src={getMuscleImage(exercise)}
                                                        alt={exercise}
                                                        style={{ width: "78%", height: "78%", objectFit: "contain" }}
                                                    />
                                                ) : "💪"}
                                            </div>
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
                    })}

                    {hasMore && (
                        <div ref={sentinelRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 0" }}>
                            <div style={{
                                width: "1.8rem",
                                height: "1.8rem",
                                borderRadius: "50%",
                                border: "3px solid #f5d3e0",
                                borderTopColor: "#FF63A4",
                                animation: "spin 0.7s linear infinite",
                            }} />
                        </div>
                    )}
                    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
                </>
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
