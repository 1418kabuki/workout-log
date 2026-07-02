"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "relative", width: "24rem" }}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="種目名を入力"
                    style={{
                        width: "100%",
                        padding: "1rem 3.5rem 1rem 1.5rem",
                        borderRadius: "1rem",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "1.4rem",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    onClick={search}
                    style={{
                        position: "absolute",
                        right: "-21rem",
                        top: "35%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ExerciseSearch
