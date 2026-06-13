"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, Plus, Trash2 } from "lucide-react"
import useAuth from "../../../utils/useAuth"

// 新規追加用の空行（idなし）
const emptyRow = () => ({
    exercise: "",
    sets: Array.from({ length: 4 }, () => ({ weight: "", reps: "" }))
})

const EditDayPage = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const params = useParams()
    const date = params.date  // "2026-06-08"
    const loginUserEmail = useAuth()

    // その日の記録を取得
    useEffect(() => {
        if (!loginUserEmail) return

        const fetchRecords = async () => {
            const res = await fetch("/api/menu/readall")
            const json = await res.json()
            const allRecords = json.data

            // 日付でフィルタ
            const dayRecords = allRecords.filter(record => {
                const d = new Date(record.createdAt)
                const isoDate = [
                    d.getFullYear(),
                    String(d.getMonth() + 1).padStart(2, "0"),
                    String(d.getDate()).padStart(2, "0"),
                ].join("-")
                return isoDate === date && record.email === loginUserEmail
            })

            // 種目ごとにグルーピング
            const grouped = dayRecords.reduce((acc, record) => {
                if (!acc[record.exercise]) acc[record.exercise] = []
                acc[record.exercise].push({ id: record.id, weight: String(record.weight), reps: String(record.reps) })
                return acc
            }, {})

            // rowsの形式に変換
            const newRows = Object.entries(grouped).map(([exercise, sets]) => ({
                exercise,
                sets,
            }))
            setRows(newRows)
            setLoading(false)
        }

        fetchRecords()
    }, [loginUserEmail, date])

    // 行を追加（新規）
    const addRow = () => setRows([...rows, emptyRow()])

    // 行を削除（既存行はDBからも削除、新規行はstateから削除）
    const removeRow = async (rowIndex) => {
        if (rows.length === 1) return
        const row = rows[rowIndex]
        for (const set of row.sets) {
            if (set.id) {
                await fetch(`/api/menu/delete/${set.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ email: loginUserEmail })
                })
            }
        }
        setRows(rows.filter((_, i) => i !== rowIndex))
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

    // 保存
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            for (const row of rows) {
                for (const set of row.sets) {
                    if (set.id) {
                        // 既存セット → PUT で更新
                        await fetch(`/api/menu/update/${set.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({
                                exercise: row.exercise,
                                weight: Number(set.weight),
                                reps: Number(set.reps),
                                memo: "",
                                image: "",
                                email: loginUserEmail,
                            })
                        })
                    } else {
                        // 新規セット → POST で作成（空はスキップ）
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
                                image: "",
                                email: loginUserEmail,
                                createdAt: `${date}T12:00:00`,
                            })
                        })
                    }
                }
            }
            router.push("/records")
        } catch {
            alert("更新に失敗しました")
        }
    }

    const displayDate = date
        ? new Date(`${date}T12:00:00`).toLocaleDateString("ja-JP", {
            year: "numeric", month: "long", day: "numeric", weekday: "short"
        })
        : ""

    if (!loginUserEmail || loading) {
        return <p style={{ fontSize: "1.6rem", color: "#9ca3af" }}>読み込み中...</p>
    }

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

    // 全rowの中で最大セット数を求めてグリッド列幅を決定
    const maxSets = rows.reduce((max, row) => Math.max(max, row.sets.length), 0)
    const gridTemplateColumns = `14rem repeat(${maxSets}, 10rem) 3.5rem`

    return (
        <div>
            <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: "0 0 0.5rem" }}>
                    {displayDate}
                </p>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: 0, color: "#333" }}>
                    記録を編集
                </h1>
            </div>

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
                            gridTemplateColumns,
                            gap: "0.8rem",
                            minWidth: "50rem",
                            marginBottom: "0.4rem",
                            paddingBottom: "1rem",
                            borderBottom: "1px solid #f0f0f0",
                        }}>
                            <p style={{ fontSize: "1.3rem", color: "#9ca3af", fontWeight: "600", margin: 0 }}>
                                種目名
                            </p>
                            {Array.from({ length: maxSets }, (_, i) => (
                                <p key={i} style={{ fontSize: "1.2rem", color: "#aaa", fontWeight: "600", margin: 0, textAlign: "center" }}>
                                    Set {i + 1}
                                </p>
                            ))}
                            <div />
                        </div>

                        {/* 種目行 */}
                        {rows.map((row, rowIndex) => {
                            const isNew = !row.sets[0]?.id  // idがない行は新規追加行
                            return (
                                <div
                                    key={rowIndex}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns,
                                        gap: "0.8rem",
                                        minWidth: "50rem",
                                        alignItems: "center",
                                        padding: "0.8rem 0",
                                        borderBottom: "1px solid #f9fafb",
                                    }}
                                >
                                    {/* 種目名（編集可能） */}
                                    <input
                                        value={row.exercise}
                                        onChange={(e) => updateExercise(rowIndex, e.target.value)}
                                        placeholder="例：ベンチプレス"
                                        style={{ ...inputStyle, textAlign: "left", padding: "0.8rem 1rem" }}
                                    />

                                    {/* セット一覧 */}
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
                                                type="text"
                                                inputMode="numeric"
                                                style={{ ...inputStyle, border: "none", background: "transparent" }}
                                            />
                                            <span style={{ fontSize: "1.3rem", color: "#9ca3af", userSelect: "none" }}>×</span>
                                            <input
                                                value={set.reps}
                                                onChange={(e) => updateSet(rowIndex, setIndex, "reps", e.target.value)}
                                                placeholder="回"
                                                type="text"
                                                inputMode="numeric"
                                                style={{ ...inputStyle, border: "none", background: "transparent" }}
                                            />
                                        </div>
                                    ))}

                                    {/* 削除ボタン（最後の1行は無効） */}
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
                            )
                        })}
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

export default EditDayPage
