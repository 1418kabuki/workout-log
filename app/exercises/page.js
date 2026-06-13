const categories = [
    {
        name: "胸",
        emoji: "🫁",
        color: "#FF63A4",
        exercises: ["ベンチプレス", "ダンベルフライ", "プッシュアップ", "ケーブルクロスオーバー"],
    },
    {
        name: "背中",
        emoji: "🔙",
        color: "#FF8C69",
        exercises: ["デッドリフト", "懸垂", "ラットプルダウン", "ベントオーバーロウ"],
    },
    {
        name: "脚",
        emoji: "🦵",
        color: "#FFD873",
        exercises: ["スクワット", "レッグプレス", "ランジ", "レッグカール"],
    },
    {
        name: "肩",
        emoji: "🏋️",
        color: "#4FC3F7",
        exercises: ["ショルダープレス", "サイドレイズ", "フロントレイズ", "リアレイズ"],
    },
    {
        name: "腕",
        emoji: "💪",
        color: "#A78BFA",
        exercises: ["バーベルカール", "ハンマーカール", "トライセプスプレスダウン", "フレンチプレス"],
    },
    {
        name: "腹",
        emoji: "🎯",
        color: "#34D399",
        exercises: ["クランチ", "レッグレイズ", "プランク", "ロシアンツイスト"],
    },
]

const ExercisesPage = () => {
    return (
        <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 2.5rem", color: "#333" }}>
                種目一覧
            </h1>

            <div className="exercises-grid">
                {categories.map(cat => (
                    <div
                        key={cat.name}
                        style={{
                            background: "white",
                            border: "1px solid #f0f0f0",
                            borderRadius: "1.5rem",
                            padding: "2rem",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Category header */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.2rem",
                            marginBottom: "1.5rem",
                            paddingBottom: "1.2rem",
                            borderBottom: "1px solid #f5f5f5",
                        }}>
                            <div style={{
                                width: "4.5rem",
                                height: "4.5rem",
                                background: `${cat.color}20`,
                                borderRadius: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2.2rem",
                                flexShrink: 0,
                            }}>
                                {cat.emoji}
                            </div>
                            <div>
                                <p style={{
                                    fontSize: "1.8rem",
                                    fontWeight: "700",
                                    color: "#333",
                                    margin: 0,
                                    lineHeight: 1.2,
                                }}>
                                    {cat.name}
                                </p>
                                <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0.3rem 0 0" }}>
                                    {cat.exercises.length}種目
                                </p>
                            </div>
                        </div>

                        {/* Exercise list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            {cat.exercises.map((ex, i) => (
                                <div
                                    key={ex}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.8rem",
                                        padding: "0.7rem 0",
                                        borderBottom: i < cat.exercises.length - 1 ? "1px solid #f9fafb" : "none",
                                    }}
                                >
                                    <span style={{
                                        width: "0.6rem",
                                        height: "0.6rem",
                                        borderRadius: "50%",
                                        background: cat.color,
                                        flexShrink: 0,
                                        display: "inline-block",
                                    }} />
                                    <p style={{ fontSize: "1.4rem", color: "#555", margin: 0 }}>
                                        {ex}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExercisesPage
