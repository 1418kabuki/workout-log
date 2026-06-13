"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Trash2, Save } from "lucide-react"
import useAuth from "../../utils/useAuth"

// 空の行を作る関数
const emptyRow = () => ({
    exercise: "",
    sets: Array.from({ length: 4 }, () => ({ weight: "", reps: "" }))
})

const CreateItem = () => {
    const [rows, setRows] = useState([emptyRow()])
    const router = useRouter()
    const searchParams = useSearchParams()
    const dateParam = searchParams.get("date") // "/menu/create?date=2026-06-08" のdateを取得。なければnull
    const loginUserEmail = useAuth()

    // 行を追加
    const addRow = () => setRows([...rows, emptyRow()])

    // 行を削除
    const removeRow = (index) => {
        if (rows.length === 1) return
        setRows(rows.filter((_, i) => i !== index))
    }

    // 種目名を更新
    const updateExercise = (rowIndex, value) => {
        setRows(rows.map((row, i) =>
            i === rowIndex ? { ...row, exercise: value } : row
        ))
    }

    // セットの値を更新
    const updateSet = (rowIndex, setIndex, field, value) => {
        setRows(rows.map((row, i) =>
            i === rowIndex ? {
                ...row,
                sets: row.sets.map((set, j) =>
                    j === setIndex ? { ...set, [field]: value } : set
                )
            } : row
        ))
    }

    // 保存（空のセットはスキップ）
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            for (const row of rows) {
                for (const set of row.sets) {
                    if (!set.weight || !set.reps) continue
                    await fetch(`/api/menu/create`, {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            exercise: row.exercise,
                            weight: Number(set.weight),
                            reps: Number(set.reps),
                            memo: "",
                            email: loginUserEmail,
                            image: "",
                            ...(dateParam ? { createdAt: `${dateParam}T12:00:00` } : {}),
                        })
                    })
                }
            }
            router.push(dateParam ? `/records/${dateParam}` : "/records")
        } catch {
            alert("記録の保存に失敗しました")
        }
    }

    if (!loginUserEmail) return <p style={{ fontSize: "1.6rem", color: "#9ca3af" }}>読み込み中...</p>

    const inputStyle = {
        width: "100%",
        padding: "0.8rem 0.4rem",
        border: "1.5px solid #e5e7eb",
        borderRadius: "0.6rem",
        fontSize: "1.4rem",
        outline: "none",
        boxSizing: "border-box",
        marginBottom: 0,
        fontFamily: "inherit",
        textAlign: "center",
    }

    return (
        <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 2.5rem", color: "#333" }}>
                {dateParam ? `${new Date(`${dateParam}T12:00:00`).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}の記録追加` : "記録追加"}
            </h1>

            <div style={{
                background: "white",
                borderRadius: "1.5rem",
                padding: "2.5rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0",
            }}>
                <form onSubmit={handleSubmit}>

                    {/* 横スクロール対応 */}
                    <div style={{ overflowX: "auto" }}>

                        {/* ヘッダー */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "14rem repeat(4, 10rem) 3.5rem",
                            gap: "0.8rem",
                            minWidth: "60rem",
                            marginBottom: "0.4rem",
                            paddingBottom: "1rem",
                            borderBottom: "1px solid #f0f0f0",
                        }}>
                            <p style={{ fontSize: "1.3rem", color: "#9ca3af", fontWeight: "600", margin: 0 }}>
                                種目名
                            </p>
                            {[1, 2, 3, 4].map(n => (
                                <p key={n} style={{ fontSize: "1.2rem", color: "#aaa", fontWeight: "600", margin: 0, textAlign: "center" }}>
                                    Set {n}
                                </p>
                            ))}
                            <div />
                        </div>

                        {/* 種目行 */}
                        {rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "14rem repeat(4, 10rem) 3.5rem",
                                    gap: "0.8rem",
                                    minWidth: "60rem",
                                    alignItems: "center",
                                    padding: "0.8rem 0",
                                    borderBottom: "1px solid #f9fafb",
                                }}
                            >
                                {/* 種目名 */}
                                <input
                                    value={row.exercise}
                                    onChange={(e) => updateExercise(rowIndex, e.target.value)}
                                    placeholder="例：ベンチプレス"
                                    required
                                    style={{ ...inputStyle, textAlign: "left", padding: "0.8rem 1rem" }}
                                />

                                {/* 4セット */}
                                {row.sets.map((set, setIndex) => (
                                    <div key={setIndex} style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr auto 1fr",
                                        gap: "0.3rem",
                                        border: "1.5px solid #e5e7eb",
                                        borderRadius: "0.8rem",
                                        padding: "0.5rem",
                                        background: "#fafafa",
                                        alignItems: "center",
                                    }}>
                                        <input
                                            value={set.weight}
                                            onChange={(e) => updateSet(rowIndex, setIndex, "weight", e.target.value)}
                                            placeholder="kg"
                                            type="text" inputMode="numeric"
                                            style={{ ...inputStyle, border: "none", background: "transparent" }}
                                        />
                                        <span style={{ fontSize: "1.3rem", color: "#9ca3af", userSelect: "none" }}>×</span>
                                        <input
                                            value={set.reps}
                                            onChange={(e) => updateSet(rowIndex, setIndex, "reps", e.target.value)}
                                            placeholder="回"
                                            type="text" inputMode="numeric"
                                            style={{ ...inputStyle, border: "none", background: "transparent" }}
                                        />
                                    </div>
                                ))}

                                {/* 削除ボタン */}
                                <button
                                    type="button"
                                    onClick={() => removeRow(rowIndex)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "3.5rem",
                                        height: "3.5rem",
                                        background: rows.length === 1 ? "#f5f5f5" : "#fff0f4",
                                        border: "none",
                                        borderRadius: "0.8rem",
                                        cursor: rows.length === 1 ? "not-allowed" : "pointer",
                                        color: rows.length === 1 ? "#ccc" : "#FF63A4",
                                        padding: 0,
                                    }}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 種目追加ボタン */}
                    <button
                        type="button"
                        onClick={addRow}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            width: "100%",
                            padding: "1.2rem",
                            background: "none",
                            border: "2px dashed #e5e7eb",
                            borderRadius: "0.8rem",
                            cursor: "pointer",
                            fontSize: "1.4rem",
                            color: "#9ca3af",
                            justifyContent: "center",
                            margin: "1.5rem 0 2.5rem",
                        }}
                    >
                        <Plus size={16} />
                        種目を追加
                    </button>

                    {/* 保存ボタン */}
                    <button
                        type="submit"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.8rem",
                            width: "100%",
                            padding: "1.3rem",
                            background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                            color: "white",
                            border: "none",
                            borderRadius: "1rem",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        <Save size={18} />
                        保存する
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<p style={{ fontSize: "1.6rem", color: "#9ca3af" }}>読み込み中...</p>}>
            <CreateItem />
        </Suspense>
    )
}
