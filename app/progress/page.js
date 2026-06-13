import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

const getProgressData = async () => {
    const records = await prisma.workoutLog.findMany({
        orderBy: { createdAt: "asc" },
    })

    // Get best (max weight) per exercise
    const exerciseMap = {}
    records.forEach(r => {
        if (!exerciseMap[r.exercise] || r.weight > exerciseMap[r.exercise].weight) {
            exerciseMap[r.exercise] = r
        }
    })

    const bests = Object.values(exerciseMap).sort((a, b) => b.weight - a.weight)
    return { bests, total: records.length }
}

const ProgressPage = async () => {
    const { bests, total } = await getProgressData()

    return (
        <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "700", margin: "0 0 2.5rem", color: "#333" }}>
                変化
            </h1>

            {/* Graph placeholder */}
            <div style={{
                background: "linear-gradient(135deg, #FF63A4 0%, #FFD873 100%)",
                borderRadius: "2rem",
                padding: "4rem 2rem",
                marginBottom: "3rem",
                color: "white",
                textAlign: "center",
                minHeight: "20rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.2rem",
            }}>
                <span style={{ fontSize: "5rem" }}>📈</span>
                <p style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
                    グラフ機能
                </p>
                <p style={{ fontSize: "1.4rem", opacity: 0.85, margin: 0 }}>
                    重量の伸びをグラフで可視化（開発中）
                </p>
            </div>

            {/* PR (Personal Records) section */}
            <div>
                <h2 style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    margin: "0 0 1.5rem",
                    color: "#333",
                }}>
                    種目別 最高重量 🏆
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {bests.map((record, index) => (
                        <div
                            key={record.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "white",
                                border: "1px solid #f0f0f0",
                                borderRadius: "1.2rem",
                                padding: "1.5rem 2rem",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                                <div style={{
                                    width: "3.5rem",
                                    height: "3.5rem",
                                    background: index === 0
                                        ? "linear-gradient(135deg, #FFD700, #FFA500)"
                                        : index === 1
                                            ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)"
                                            : index === 2
                                                ? "linear-gradient(135deg, #CD7F32, #A0522D)"
                                                : "linear-gradient(135deg, rgba(255,99,164,0.1), rgba(255,216,115,0.1))",
                                    borderRadius: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.6rem",
                                    flexShrink: 0,
                                }}>
                                    {index < 3 ? "🏆" : "💪"}
                                </div>
                                <p style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "600",
                                    color: "#333",
                                    margin: 0,
                                }}>
                                    {record.exercise}
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{
                                    fontSize: "1.8rem",
                                    fontWeight: "700",
                                    color: "#FF63A4",
                                    margin: 0,
                                }}>
                                    {record.weight}kg
                                </p>
                                <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0.2rem 0 0" }}>
                                    {record.reps}回
                                </p>
                            </div>
                        </div>
                    ))}

                    {bests.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "5rem 2rem",
                            border: "2px dashed #e5e7eb",
                            borderRadius: "1.5rem",
                        }}>
                            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</p>
                            <p style={{ fontSize: "1.5rem", color: "#9ca3af", margin: 0 }}>
                                記録を追加すると変化が表示されます
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProgressPage
