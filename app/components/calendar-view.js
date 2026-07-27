"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
        // 記録済みならその日の内容を読み込んで編集、未記録なら新規追加になる
        router.push(`/menu/create?date=${isoDate}`)
    }

    return (
        <Card className="mb-[3rem] rounded-[1.6rem] p-[2.2rem] shadow-md ring-0">
            {/* 月ナビゲーション */}
            <div className="mb-[1.6rem] flex items-center justify-between">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className="size-[3.2rem] rounded-[0.8rem] text-[#383c42]"
                >
                    <ChevronLeft size={16} />
                </Button>

                <p className="text-[1.6rem] font-bold text-foreground">
                    {year}年 {month + 1}月
                </p>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="size-[3.2rem] rounded-[0.8rem] text-[#383c42]"
                >
                    <ChevronRight size={16} />
                </Button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="mb-[0.8rem] grid grid-cols-7">
                {WEEKDAYS.map((day, i) => (
                    <p
                        key={day}
                        className={`text-center text-[1.2rem] font-semibold ${
                            i === 0 ? "text-primary" : i === 6 ? "text-[#6b9fff]" : "text-[#9ca3af]"
                        }`}
                    >
                        {day}
                    </p>
                ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-[0.4rem]">
                {cells.map((day, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => day && handleDayClick(day)}
                        disabled={!day}
                        aria-label={day ? `${year}年${month + 1}月${day}日` : undefined}
                        className={`flex w-auto flex-col items-center justify-center gap-[0.3rem] rounded-[0.8rem] border-0 p-0 py-[0.6rem] hover:opacity-80 disabled:cursor-default disabled:hover:opacity-100 ${
                            day ? "cursor-pointer" : "cursor-default"
                        } ${isToday(day) ? "bg-primary" : "bg-transparent hover:bg-transparent"}`}
                    >
                        <p
                            className={`text-[1.4rem] ${isToday(day) ? "font-bold text-white" : "font-normal"} ${
                                !isToday(day) && (i % 7 === 0 ? "text-primary" : i % 7 === 6 ? "text-[#6b9fff]" : "text-foreground")
                            }`}
                        >
                            {day || ""}
                        </p>
                        {/* 記録ありのドット */}
                        {day && hasRecord(day) && (
                            <div className={`size-[0.9rem] rounded-full ${isToday(day) ? "bg-white" : "bg-primary"}`} />
                        )}
                    </button>
                ))}
            </div>
        </Card>
    )
}

export default CalendarView
