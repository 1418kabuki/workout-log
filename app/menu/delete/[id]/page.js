"use client"
import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useAuth from "../../../utils/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const inputClass = "mb-[1rem] w-full rounded-[0.8rem] border border-border px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none box-border focus:ring-2 focus:ring-ring/50 focus:border-ring"

const DeleteItem = (context) => {
    const [exercise, setExercise] = useState("")
    const [weight, setWeight] = useState("")
    const [image, setImage] = useState("")
    const [reps, setReps] = useState("")
    const [memo, setMemo] = useState("")
    const [email, setEmail] = useState("")
    const router = useRouter()
    const loginUserEmail = useAuth()

    useEffect(() => {
        const getSingleItem = async () => {
            const params = await context.params
            const response = await fetch(`/api/menu/readsingle/${params.id}`)
            const jsonData = await response.json()
            const singleData = jsonData.data
            setExercise(singleData.exercise)
            setWeight(singleData.weight)
            setImage(singleData.image)
            setReps(singleData.reps)
            setMemo(singleData.memo)
            setEmail(singleData.email)
        }
        getSingleItem()
    }, [context])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const params = await context.params
        try {
            const response = await fetch(`/api/menu/delete/${params.id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    exercise: exercise,
                    weight: Number(weight),
                    image: Number(image),
                    reps: reps,
                    memo: memo,
                    email: loginUserEmail
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)
            router.push("/")
        } catch {
            alert("メニュー削除失敗")
        }
    }


    if (loginUserEmail === "" || email === "") {
        return <p className="text-[1.6rem] text-[#383c42]">読み込み中...</p>
    } else if (loginUserEmail === email) {
        return (
            <div>
                <h1 className="mb-[2.5rem] text-center text-[2.4rem] font-bold text-foreground">メニュー削除</h1>
                <Card className="gap-0 rounded-[1.6rem] p-[2.5rem] shadow-md ring-0">
                    <form onSubmit={handleSubmit}>
                        <input value={exercise} onChange={(e) => setExercise(e.target.value)} type="text" name="exercise" placeholder="種目" required className={inputClass} />
                        <input value={weight} onChange={(e) => setWeight(e.target.value)} type="text" name="weight" placeholder="重量" required className={inputClass} />
                        <input value={reps} onChange={(e) => setReps(e.target.value)} type="text" name="reps" placeholder="回数" required className={inputClass} />
                        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} name="memo" rows={10} placeholder="メモ" required className={`${inputClass} resize-y`}></textarea>
                        <Button type="submit" variant="destructive" className="h-auto w-full justify-center rounded-[1rem] py-[1.3rem] text-[1.6rem] font-semibold">
                            削除
                        </Button>
                    </form>
                </Card>
            </div>
        )
    } else {
        return <h1 className="text-[2rem] font-bold text-foreground">権限がありません</h1>
    }

}

export default DeleteItem
