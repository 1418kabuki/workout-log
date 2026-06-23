"use client"
import { useState } from "react"

// 胸種目の写真（実際の写真URLに差し替え可能）
const chestImages = {
    "ベンチプレス": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop",
    "ダンベルフライ": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=80&h=80&fit=crop",
    "プッシュアップ": "https://images.unsplash.com/photo-1598971639058-fab3c3109a53?w=80&h=80&fit=crop",
    "ケーブルクロスオーバー": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=80&h=80&fit=crop",
    "インクラインベンチプレス": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=80&h=80&fit=crop",
    "ディップス": "https://images.unsplash.com/photo-1598265760575-a791b35de37e?w=80&h=80&fit=crop",
}

const categories = [
    {
        name: "胸",
        color: "#FF63A4",
        exercises: ["ベンチプレス", "ダンベルフライ", "プッシュアップ", "ケーブルクロスオーバー", "インクラインベンチプレス", "ディップス"],
    },
    {
        name: "背中",
        color: "#FF8C69",
        exercises: ["デッドリフト", "懸垂", "ラットプルダウン", "ベントオーバーロウ", "シーテッドロウ", "ワンアームロウ"],
    },
    {
        name: "肩",
        color: "#4FC3F7",
        exercises: ["ショルダープレス", "サイドレイズ", "フロントレイズ", "リアレイズ", "アーノルドプレス", "フェイスプル"],
    },
    {
        name: "腕",
        color: "#A78BFA",
        exercises: ["バーベルカール", "ハンマーカール", "トライセプスプレスダウン", "フレンチプレス", "コンセントレーションカール", "スカルクラッシャー"],
    },
    {
        name: "脚",
        color: "#FFD873",
        exercises: ["スクワット", "レッグプレス", "ランジ", "レッグカール", "レッグエクステンション", "カーフレイズ"],
    },
    {
        name: "腹筋",
        color: "#34D399",
        exercises: ["クランチ", "レッグレイズ", "プランク", "ロシアンツイスト", "バイシクルクランチ", "ハンギングレッグレイズ"],
    },
]

const ExercisesPage = () => {
    const [activeTab, setActiveTab] = useState("胸")

    const activeCat = categories.find(cat => cat.name === activeTab)

    return (
        <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 2rem", color: "#333" }}>
                種目一覧
            </h1>

            {/* タブ */}
            <div style={{
                display: "flex",
                background: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "1.2rem",
                padding: "0.4rem",
                marginBottom: "2.5rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
                {categories.map(cat => {
                    const isActive = cat.name === activeTab
                    return (
                        <button
                            key={cat.name}
                            onClick={() => setActiveTab(cat.name)}
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.9rem 0",
                                borderRadius: "0.8rem",
                                border: "none",
                                background: isActive ? "rgba(255,99,164,0.12)" : "transparent",
                                color: isActive ? "#FF63A4" : "#9ca3af",
                                fontSize: "1.3rem",
                                fontWeight: isActive ? "700" : "400",
                                cursor: "pointer",
                            }}
                        >
                            {cat.name}
                        </button>
                    )
                })}
            </div>

            {/* 選択中のカテゴリの種目一覧 */}
            {activeCat && (
                <div style={{
                    background: "white",
                    border: "1px solid #f0f0f0",
                    borderRadius: "1.5rem",
                    padding: "2.5rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}>
                    {/* ヘッダー */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "2rem",
                        paddingBottom: "1.5rem",
                        borderBottom: "1px solid #f5f5f5",
                    }}>
                        <p style={{ fontSize: "2rem", fontWeight: "700", color: "#333", margin: 0 }}>
                            {activeCat.name}
                        </p>
                        <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: 0 }}>
                            {activeCat.exercises.length}種目
                        </p>
                    </div>

                    {/* 種目リスト */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {activeCat.exercises.map((ex, i) => {
                            const imgUrl = activeTab === "胸" ? chestImages[ex] : null
                            return (
                                <div
                                    key={ex}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1.4rem",
                                        padding: "1.2rem 0",
                                        borderBottom: i < activeCat.exercises.length - 1 ? "1px solid #f9fafb" : "none",
                                    }}
                                >
                                    {imgUrl && (
                                        <img
                                            src={imgUrl}
                                            alt={ex}
                                            style={{
                                                width: "5.6rem",
                                                height: "5.6rem",
                                                borderRadius: "1rem",
                                                objectFit: "cover",
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                    <p style={{ fontSize: "1.5rem", color: "#333", margin: 0, fontWeight: "500" }}>
                                        {ex}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExercisesPage
