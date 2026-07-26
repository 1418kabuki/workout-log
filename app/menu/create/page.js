"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Trash2, Save } from "lucide-react"
import useAuth from "../../utils/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// 空の行を作る関数（新規行なのでidなし）
const emptyRow = () => ({
    exercise: "",
    sets: Array.from({ length: 4 }, () => ({ weight: "", reps: "" }))
})

// 今日の日付をYYYY-MM-DD形式で返す
const todayISO = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const inputClass = "mb-0 w-full rounded-[0.6rem] border border-border py-[0.8rem] px-[0.4rem] text-[1.4rem] text-center outline-none box-border focus:ring-2 focus:ring-ring/50 focus:border-ring"

const CreateItem = () => {
    const [rows, setRows] = useState([emptyRow()])
    const [loading, setLoading] = useState(true)
    const [hasExisting, setHasExisting] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const dateParam = searchParams.get("date") // "/menu/create?date=2026-06-08" のdateを取得。なければnull
    const [date, setDate] = useState(dateParam || todayISO())
    const loginUserEmail = useAuth()

    // 日付が変わるたびに、その日の既存記録を読み込む（なければ新規追加フォームにする）
    useEffect(() => {
        if (!loginUserEmail) return
        setLoading(true)

        const fetchRecords = async () => {
            const res = await fetch("/api/menu/readall", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            const json = await res.json()
            const allRecords = json.data || []

            const dayRecords = allRecords.filter(record => {
                const d = new Date(record.createdAt)
                const isoDate = [
                    d.getFullYear(),
                    String(d.getMonth() + 1).padStart(2, "0"),
                    String(d.getDate()).padStart(2, "0"),
                ].join("-")
                return isoDate === date && record.email === loginUserEmail
            })

            if (dayRecords.length === 0) {
                setRows([emptyRow()])
                setHasExisting(false)
            } else {
                // 種目ごとにグルーピング（idを持たせて既存セットと分かるようにする）
                const grouped = dayRecords.reduce((acc, record) => {
                    if (!acc[record.exercise]) acc[record.exercise] = []
                    acc[record.exercise].push({ id: record.id, weight: String(record.weight), reps: String(record.reps) })
                    return acc
                }, {})
                setRows(Object.entries(grouped).map(([exercise, sets]) => ({ exercise, sets })))
                setHasExisting(true)
            }
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

    // 保存（既存セットは更新、新規セットは追加。空のセットはスキップ）
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const groupId = crypto.randomUUID()
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
                                email: loginUserEmail,
                                image: "",
                                groupId,
                                createdAt: `${date}T12:00:00`,
                            })
                        })
                    }
                }
            }
            router.push("/records")
        } catch {
            alert("記録の保存に失敗しました")
        }
    }

    if (!loginUserEmail || loading) return <p className="text-[1.6rem] text-[#383c42]">読み込み中...</p>

    // 全rowの中で最大セット数を求めてグリッド列幅を決定（最低4列）
    const maxSets = Math.max(4, ...rows.map(row => row.sets.length))
    const gridTemplateColumns = `14rem repeat(${maxSets}, 10rem) 3.5rem`
    const gridMinWidth = `${14 + maxSets * 10 + 3.5}rem`

    return (
        <div>
            <h1 className="mb-[2.5rem] text-[2.6rem] font-bold text-foreground">
                {hasExisting
                    ? `${new Date(`${date}T12:00:00`).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}の記録を編集`
                    : `${new Date(`${date}T12:00:00`).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}の記録追加`}
            </h1>

            <Card className="gap-0 rounded-[1.6rem] p-[2.5rem] shadow-md ring-0">
                <form onSubmit={handleSubmit}>

                    {/* 日付選択 */}
                    <div className="mb-[2.2rem]">
                        <label className="mb-[0.7rem] block text-[1.3rem] font-semibold text-[#383c42]">
                            記録する日付
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-auto rounded-[0.8rem] border border-border px-[1.2rem] py-[0.9rem] text-[1.4rem] text-foreground outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                        />
                    </div>

                    {/* 横スクロール対応 */}
                    <div className="overflow-x-auto">

                        {/* ヘッダー */}
                        <div
                            className="mb-[0.4rem] grid gap-[0.8rem] border-b border-border pb-[1rem]"
                            style={{ gridTemplateColumns, minWidth: gridMinWidth }}
                        >
                            <p className="text-[1.3rem] font-semibold text-[#383c42]">
                                種目名
                            </p>
                            {Array.from({ length: maxSets }, (_, i) => (
                                <p key={i} className="text-center text-[1.2rem] font-semibold text-[#9ca3af]">
                                    Set {i + 1}
                                </p>
                            ))}
                            <div />
                        </div>

                        {/* 種目行 */}
                        {rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="grid items-center gap-[0.8rem] border-b border-border/60 py-[0.8rem]"
                                style={{ gridTemplateColumns, minWidth: gridMinWidth }}
                            >
                                {/* 種目名 */}
                                <input
                                    value={row.exercise}
                                    onChange={(e) => updateExercise(rowIndex, e.target.value)}
                                    placeholder="例：ベンチプレス"
                                    required
                                    className={`${inputClass} text-left px-[1rem]`}
                                />

                                {/* セット */}
                                {row.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="grid grid-cols-[1fr_auto_1fr] items-center gap-[0.3rem] rounded-[0.8rem] border border-border bg-[#fafafa] p-[0.5rem]">
                                        <input
                                            value={set.weight}
                                            onChange={(e) => updateSet(rowIndex, setIndex, "weight", e.target.value)}
                                            placeholder="kg"
                                            type="text" inputMode="numeric"
                                            className={`${inputClass} border-0 bg-transparent`}
                                        />
                                        <span className="select-none text-[1.3rem] text-[#9ca3af]">×</span>
                                        <input
                                            value={set.reps}
                                            onChange={(e) => updateSet(rowIndex, setIndex, "reps", e.target.value)}
                                            placeholder="回"
                                            type="text" inputMode="numeric"
                                            className={`${inputClass} border-0 bg-transparent`}
                                        />
                                    </div>
                                ))}

                                {/* 削除ボタン */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => removeRow(rowIndex)}
                                    disabled={rows.length === 1}
                                    className="size-[3.5rem] rounded-[0.8rem] bg-primary/10 text-primary hover:bg-primary/20 disabled:bg-[#f5f5f5] disabled:text-[#ccc]"
                                >
                                    <Trash2 size={15} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* 種目追加ボタン */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addRow}
                        className="my-[1.5rem] h-auto w-full justify-center rounded-[0.8rem] border-2 border-dashed border-border bg-transparent py-[1.2rem] text-[1.4rem] text-[#383c42] hover:bg-[#fafafa]"
                    >
                        <Plus size={16} />
                        種目を追加
                    </Button>

                    {/* 保存ボタン */}
                    <Button
                        type="submit"
                        className="h-auto w-full justify-center rounded-[1rem] bg-gradient-to-br from-[#FF63A4] to-[#FFD873] py-[1.3rem] text-[1.6rem] font-semibold text-white hover:opacity-90"
                    >
                        <Save size={18} />
                        保存する
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<p className="text-[1.6rem] text-[#383c42]">読み込み中...</p>}>
            <CreateItem />
        </Suspense>
    )
}
