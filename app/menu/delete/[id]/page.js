"use client"
import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useAuth from "../../../utils/useAuth"

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/menu/readsingle/${params.id}`)
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/menu/delete/${params.id}`, {
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


    if (loginUserEmail === email) {
        return (
            <div>
                <h1 className="page-title">メニュー削除</h1>
                <form onSubmit={handleSubmit}>
                    <input value={exercise} onChange={(e) => setExercise(e.target.value)} type="text" name="exercise" placeholder="種目" required />
                    <input value={weight} onChange={(e) => setWeight(e.target.value)} type="text" name="weight" placeholder="重量" required />
                    {/* <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="画像" required /> */}
                    <input value={reps} onChange={(e) => setReps(e.target.value)} type="text" name="reps" placeholder="回数" required />
                    <textarea value={memo} onChange={(e) => setMemo(e.target.value)} name="memo" rows={15} placeholder="メモ" required></textarea>
                    <button>削除</button>
                </form>
            </div>
        )
    } else {
        return <h1>権限がありません</h1>
    }

}

export default DeleteItem