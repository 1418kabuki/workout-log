"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const ExerciseSearch = ({ defaultValue }) => {
    const router = useRouter()
    const [value, setValue] = useState(defaultValue || "")

    const search = () => {
        if (value) {
            router.push(`/progress?exercise=${encodeURIComponent(value)}`)
        } else {
            router.push("/progress")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") search()
    }

    return (
        <div className="relative w-full max-w-[24rem]">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="種目名を入力"
                className="mb-0 w-full rounded-[1rem] border border-border py-[1rem] pl-[1.5rem] pr-[3.5rem] text-[1.4rem] outline-none box-border focus:ring-2 focus:ring-ring/50 focus:border-ring"
            />
            <button
                onClick={search}
                className="absolute right-[1.2rem] top-1/2 flex w-auto -translate-y-1/2 items-center border-0 bg-transparent p-0 text-[#9ca3af]"
            >
                <Search size={18} strokeWidth={2.5} />
            </button>
        </div>
    )
}

export default ExerciseSearch
