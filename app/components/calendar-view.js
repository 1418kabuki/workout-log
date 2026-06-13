"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

const CalendarView = ({ markedDates }) => {
    const today = new Date()
    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth()) // 0-indexed
    const router = useRouter()

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(year - 1) }
        else setMonth(month - 1)
    }

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(year + 1) }
        else setMonth(month + 1)
    }

    // その月の1日が何曜日か（0=日, 6=土）
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    // その月の日数
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // カレンダーのセル配列（空白 + 日付）
    const cells = [
        ...Array(firstDayOfWeek).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        )
    }

    const hasRecord = (day) => {
        const isoDate = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0"),
        ].join("-")
        return markedDates.includes(isoDate)
    }

    const handleDayClick = (day) => {
        const isoDate = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0"),
        ].join("-")
        router.push(`/records/${isoDate}`)
    }

    return (
        <div style={{
            background: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "1.5rem",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}>
            {/* 月ナビゲーション */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.6rem",
            }}>
                <button
                    onClick={prevMonth}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "3.2rem",
                        height: "3.2rem",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.8rem",
                        cursor: "pointer",
                        color: "#555",
                        padding: 0,
                    }}
                >
                    <ChevronLeft size={16} />
                </button>

                <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: 0 }}>
                    {year}年 {month + 1}月
                </p>

                <button
                    onClick={nextMonth}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "3.2rem",
                        height: "3.2rem",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.8rem",
                        cursor: "pointer",
                        color: "#555",
                        padding: 0,
                    }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* 曜日ヘッダー */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: "0.8rem",
            }}>
                {WEEKDAYS.map((day, i) => (
                    <p key={day} style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        textAlign: "center",
                        margin: 0,
                        color: i === 0 ? "#FF63A4" : i === 6 ? "#6b9fff" : "#9ca3af",
                    }}>
                        {day}
                    </p>
                ))}
            </div>

            {/* 日付グリッド */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.4rem",
            }}>
                {cells.map((day, i) => (
                    <div
                        key={i}
                        onClick={() => day && handleDayClick(day)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.3rem",
                            padding: "0.6rem 0",
                            borderRadius: "0.8rem",
                            cursor: day ? "pointer" : "default",
                            background: isToday(day)
                                ? "linear-gradient(135deg, #FF63A4, #FFD873)"
                                : "transparent",
                        }}
                    >
                        <p style={{
                            fontSize: "1.4rem",
                            fontWeight: isToday(day) ? "700" : "400",
                            margin: 0,
                            color: isToday(day)
                                ? "white"
                                : i % 7 === 0 ? "#FF63A4"
                                : i % 7 === 6 ? "#6b9fff"
                                : "#333",
                        }}>
                            {day || ""}
                        </p>
                        {/* 記録ありのドット */}
                        {day && hasRecord(day) && (
                            <div style={{
                                width: "0.5rem",
                                height: "0.5rem",
                                borderRadius: "50%",
                                background: isToday(day) ? "white" : "#FF63A4",
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CalendarView
