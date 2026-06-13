import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

const getRecordsByDate = async (date) => {
    const records = await prisma.workoutLog.findMany({
        orderBy: { createdAt: "asc" },
    })

    // 指定日付のレコードだけ絞り込む
    return records.filter(record => {
        const d = new Date(record.createdAt)
        const isoDate = [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0"),
        ].join("-")
        return isoDate === date
    })
}

const RecordDatePage = async ({ params }) => {
    const { date } = await params
    const records = await getRecordsByDate(date)

    const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString("ja-JP", {
        year: "numeric", month: "long", day: "numeric", weekday: "short"
    })

    // 種目ごとにグルーピング
    const grouped = records.reduce((acc, record) => {
        if (!acc[record.exercise]) acc[record.exercise] = []
        acc[record.exercise].push({ weight: record.weight, reps: record.reps })
        return acc
    }, {})

    const exerciseCount = Object.keys(grouped).length
    const setCount = records.length

    return (
        <div>
            {/* ページヘッダー */}
            <div style={{ marginBottom: "2.5rem" }}>
                <Link
                    href="/records"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "1.4rem",
                        color: "#9ca3af",
                        marginBottom: "1rem",
                    }}
                >
                    <ChevronLeft size={16} />
                    記録に戻る
                </Link>
                <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: "0 0 0.4rem" }}>
                    {displayDate}
                </p>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 0.4rem", color: "#333" }}>
                    この日の記録
                </h1>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.2rem" }}>
                    <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: 0 }}>
                        {exerciseCount}種目 · {setCount}セット
                    </p>
                    <Link
                        href={`/menu/create?date=${date}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.7rem 1.6rem",
                            background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                            color: "white",
                            borderRadius: "10rem",
                            fontSize: "1.4rem",
                            fontWeight: "500",
                            textDecoration: "none",
                        }}
                    >
                        <Plus size={15} />
                        追加
                    </Link>
                </div>
            </div>

            {records.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "6rem 2rem",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "1.5rem",
                }}>
                    <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏋️</p>
                    <p style={{ fontSize: "1.6rem", color: "#9ca3af", margin: 0 }}>
                        記録がありません
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* 記録カード（タップで編集へ） */}
                    <Link
                        href={`/menu/edit-day/${date}`}
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
                        {/* カードヘッダー */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "1.2rem",
                            borderBottom: "1px solid #f5f5f5",
                        }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: "600", color: "#333", margin: 0 }}>
                                ワークアウト
                            </p>
                            <p style={{
                                fontSize: "1.2rem",
                                color: "#FF63A4",
                                margin: 0,
                                background: "rgba(255,99,164,0.08)",
                                padding: "0.3rem 1rem",
                                borderRadius: "10rem",
                                fontWeight: "600",
                            }}>
                                タップして編集
                            </p>
                        </div>

                        {/* 種目一覧 */}
                        {Object.entries(grouped).map(([exercise, sets], i, arr) => (
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
                                {/* 種目名 */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                                    <span style={{ fontSize: "1.6rem" }}>💪</span>
                                    <p style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        color: "#333",
                                        margin: 0,
                                    }}>
                                        {exercise}
                                    </p>
                                </div>

                                {/* セット一覧 */}
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.6rem",
                                    justifyContent: "flex-end",
                                }}>
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
            )}
        </div>
    )
}

export default RecordDatePage
