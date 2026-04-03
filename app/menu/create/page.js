"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useAuth from "../../utils/useAuth"

const CreateItem = () => {
    const [exercise, setExercise] = useState("")
    const [weight, setWeight] = useState("")
    const [image, setImage] = useState("")
    const [reps, setReps] = useState("")
    const [memo, setMemo] = useState("")

    const router = useRouter()
    const loginUserEmail = useAuth()

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log("今から送信するデータ:", { exercise, loginUserEmail });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/menu/create`, {
            // const response = await fetch("/api/menu/create", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    exercise: exercise,
                    weight: Number(weight),
                    image: image,
                    reps: Number(reps),
                    memo: memo,
                    email: loginUserEmail
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)
            router.push("/")
        } catch {
            alert("メニュー作成失敗")
        }
    }

    if(loginUserEmail){
        return (
        <div>
            <h1 className="page-title">メニュー作成</h1>
            <form onSubmit={handleSubmit}>
                <input value={exercise} onChange={(e) => setExercise(e.target.value)} type="text" name="exercise" placeholder="種目" required />
                <input value={weight} onChange={(e) => setWeight(e.target.value)} type="text" name="weight" placeholder="重量" required />
                <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="画像" required />
                <input value={reps} onChange={(e) => setReps(e.target.value)} type="text" name="reps" placeholder="回数" required />
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} name="memo" rows={15} placeholder="種目説明" required></textarea>
                <button>作成</button>
            </form>
        </div>
    )
    }
}

export default CreateItem