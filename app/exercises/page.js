"use client"
import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const chestExercises = [
    {
        name: "ベンチプレス",
        level: "中級",
        target: "大胸筋・三角筋前部・上腕三頭筋",
        desc: "バーベルを使った胸のBIG3種目。大胸筋全体を鍛える基本種目。",
        image: "/images/muscles/bench-press.png",
    },
    {
        name: "インクラインベンチプレス",
        level: "中級",
        target: "大胸筋上部・三角筋前部",
        desc: "ベンチを30〜45度に傾けて行うプレス。大胸筋上部に効かせやすい。",
        image: "/images/muscles/incline-bench-press.png",
    },
    {
        name: "ダンベルフライ",
        level: "初級",
        target: "大胸筋・前鋸筋",
        desc: "ダンベルを弧を描くように動かし、大胸筋をストレッチしながら収縮させる。",
        image: "/images/muscles/dumbbell-fly.png",
    },
    {
        name: "ケーブルクロスオーバー",
        level: "中級",
        target: "大胸筋内側・下部",
        desc: "ケーブルマシンを使い、大胸筋の内側と下部を集中的に鍛える仕上げ種目。",
    },
    {
        name: "プッシュアップ",
        level: "初級",
        target: "大胸筋・上腕三頭筋・三角筋前部",
        desc: "自重で行える基本種目。フォームを意識することで大胸筋への刺激が高まる。",
    },
    {
        name: "ディップス",
        level: "中級",
        target: "大胸筋下部・上腕三頭筋",
        desc: "平行棒を使った自重種目。前傾姿勢を強くすると大胸筋下部に効く。",
        image: "/images/muscles/dips.png",
    },
    {
        name: "チェストマシンプレス",
        level: "初級",
        target: "大胸筋・三角筋前部・上腕三頭筋",
        desc: "マシンを使って行う胸のプレス種目。軌道が固定されているためフォームが安定しやすく初心者にも取り組みやすい。",
        image: "/images/muscles/chest-machine-press.png",
    },
]

export const muscleImages = {
    "胸": "/images/muscles/chest.svg",
    "背中": "/images/muscles/back.svg",
    "肩": "/images/muscles/shoulders.svg",
    "腕": "/images/muscles/arms.svg",
    "脚": "/images/muscles/legs.svg",
    "腹筋": "/images/muscles/abs.svg",
}

const levelColor = {
    "初級": "#34D399",
    "中級": "#FFD873",
    "上級": "#FF63A4",
}

const categories = [
    { name: "胸", color: "#FF63A4" },
    { name: "背中", color: "#FF8C69" },
    { name: "肩", color: "#4FC3F7" },
    { name: "腕", color: "#A78BFA" },
    { name: "脚", color: "#FFD873" },
    { name: "腹筋", color: "#34D399" },
]

export const otherExercises = {
    "背中": [
        {
            name: "デッドリフト",
            level: "上級",
            target: "脊柱起立筋・広背筋・大殿筋・ハムストリングス",
            desc: "床からバーベルを引き上げる背中と下半身の複合種目。全身の筋力を底上げする代表的なBIG3種目。",
        },
        {
            name: "懸垂",
            level: "中級",
            target: "広背筋・僧帽筋・上腕二頭筋",
            desc: "自重で行う背中の基本種目。逆手・順手でターゲットが変わる。",
            image: "/images/muscles/pull-up.png",
        },
        {
            name: "ラットプルダウン",
            level: "初級",
            target: "広背筋・僧帽筋下部",
            desc: "マシンを使い、懸垂の動きを補助付きで行える種目。背中の広がりを作る。",
            image: "/images/muscles/lat-pulldown.png",
        },
        {
            name: "ベントオーバーローイング",
            level: "中級",
            target: "広背筋・僧帽筋・脊柱起立筋",
            desc: "前傾姿勢でバーベルを引く種目。背中の厚みを作る効果が高い。",
            image: "/images/muscles/bent-over-row.png",
        },
        {
            name: "シーテッドローイング",
            level: "初級",
            target: "広背筋・僧帽筋中部・菱形筋",
            desc: "座った姿勢でケーブルを引く種目。背中を安定して鍛えられる。",
            image: "/images/muscles/seated-row.png",
        },
        {
            name: "ワンハンドローイング",
            level: "中級",
            target: "広背筋・僧帽筋・上腕二頭筋",
            desc: "片手ずつダンベルを引く種目。左右差の調整や可動域確保に向く。",
            image: "/images/muscles/one-hand-row.png",
        },
    ],
    "肩": [
        {
            name: "ショルダーマシンプレス",
            level: "初級",
            target: "三角筋前部・中部・上腕三頭筋",
            desc: "マシンを使って頭上に押し上げる肩のプレス系種目。軌道が安定しているため初心者でも扱いやすい。",
            image: "/images/muscles/shoulder-machine-press.png",
        },
        {
            name: "サイドレイズ",
            level: "初級",
            target: "三角筋中部",
            desc: "腕を横に上げるアイソレーション種目。肩幅を広げる中部に集中して効かせる。",
            image: "/images/muscles/side-raise.png",
        },
        {
            name: "フロントレイズ",
            level: "初級",
            target: "三角筋前部",
            desc: "腕を正面に上げる種目。肩の前側を集中的に鍛える。",
        },
        {
            name: "リアレイズ",
            level: "初級",
            target: "三角筋後部・僧帽筋",
            desc: "前傾姿勢で腕を後ろに上げる種目。肩の後部を鍛え姿勢改善にも役立つ。",
            image: "/images/muscles/rear-raise.png",
        },
        {
            name: "アーノルドプレス",
            level: "中級",
            target: "三角筋前部・中部",
            desc: "手首を回旋させながら押し上げるプレス種目。肩全体に刺激を加えられる。",
            image: "/images/muscles/arnold-press.png",
        },
        {
            name: "フェイスプル",
            level: "初級",
            target: "三角筋後部・僧帽筋中部",
            desc: "ケーブルを顔に向かって引く種目。肩甲骨まわりと後部三角筋を鍛える。",
        },
        {
            name: "スミスマシンプレス",
            level: "初級",
            target: "三角筋前部・中部・上腕三頭筋",
            desc: "スミスマシンのバーを使って行うショルダープレス。軌道が固定されているため安定してプレス動作に集中できる。",
            image: "/images/muscles/smith-machine-press.png",
        },
        {
            name: "ダンベルプレス",
            level: "中級",
            target: "三角筋前部・中部・上腕三頭筋",
            desc: "ダンベルを使って肩上へ押し上げる種目。左右独立して動かせるため可動域を広く使える。",
            image: "/images/muscles/dumbbell-press.png",
        },
    ],
    "腕": [
        {
            name: "バーベルカール",
            level: "中級",
            target: "上腕二頭筋",
            desc: "バーベルを使った腕の基本種目。二頭筋全体に効かせる王道種目。",
            image: "/images/muscles/barbell-curl.png",
        },
        {
            name: "ハンマーカール",
            level: "初級",
            target: "上腕二頭筋・上腕筋・前腕",
            desc: "ダンベルを縦に持って行うカール。二頭筋と前腕を同時に鍛える。",
            image: "/images/muscles/hammer-curl.png",
        },
        {
            name: "トライセプスプレスダウン",
            level: "初級",
            target: "上腕三頭筋",
            desc: "ケーブルを押し下げる種目。三頭筋の仕上げに使われる代表種目。",
        },
        {
            name: "フレンチプレス",
            level: "中級",
            target: "上腕三頭筋長頭",
            desc: "頭上でダンベルやバーベルを上下させる種目。三頭筋の長頭にしっかり効く。",
            image: "/images/muscles/french-press.png",
        },
        {
            name: "コンセントレーションカール",
            level: "初級",
            target: "上腕二頭筋",
            desc: "肘を固定して行うカール。二頭筋の収縮を強く感じられる種目。",
        },
        {
            name: "スカルクラッシャー",
            level: "中級",
            target: "上腕三頭筋",
            desc: "仰向けでバーベルを額の近くまで下ろす種目。三頭筋に強い負荷がかかる。",
        },
        {
            name: "インクラインダンベルカール",
            level: "中級",
            target: "上腕二頭筋",
            desc: "インクラインベンチに座り、腕を後方に伸ばした状態で行うカール。二頭筋のストレッチを強めに効かせられる。",
            image: "/images/muscles/incline-dumbbell-curl.png",
        },
        {
            name: "ダンベルキックバック",
            level: "初級",
            target: "上腕三頭筋",
            desc: "前傾姿勢で肘を固定し、腕を後方に伸ばす種目。三頭筋の収縮を意識しやすい仕上げ種目。",
            image: "/images/muscles/dumbbell-kickback.png",
        },
    ],
    "脚": [
        {
            name: "スクワット",
            level: "上級",
            target: "大腿四頭筋・大殿筋・ハムストリングス",
            desc: "バーベルを担いで行う下半身のBIG3種目。全身の筋力アップに直結する。",
            image: "/images/muscles/squat.png",
        },
        {
            name: "レッグマシンプレス",
            level: "初級",
            target: "大腿四頭筋・大殿筋",
            desc: "マシンに座って脚で重量を押す種目。腰への負担を抑えつつ脚全体を鍛えられる。",
            image: "/images/muscles/leg-machine-press.png",
        },
        {
            name: "ランジ",
            level: "初級",
            target: "大腿四頭筋・大殿筋・ハムストリングス",
            desc: "片足ずつ踏み込む種目。バランス感覚と脚力を同時に鍛えられる。",
        },
        {
            name: "レッグカール",
            level: "初級",
            target: "ハムストリングス",
            desc: "うつ伏せや座った姿勢で膝を曲げる種目。ハムストリングスを集中的に鍛える。",
            image: "/images/muscles/leg-curl.png",
        },
        {
            name: "レッグエクステンション",
            level: "初級",
            target: "大腿四頭筋",
            desc: "座った姿勢で膝を伸ばす種目。大腿四頭筋を単関節で鍛えられる。",
            image: "/images/muscles/leg-extension.png",
        },
        {
            name: "カーフレイズ",
            level: "初級",
            target: "下腿三頭筋（ふくらはぎ）",
            desc: "かかとを上げ下げする種目。ふくらはぎを鍛える代表的な種目。",
        },
        {
            name: "ブルガリアンスクワット",
            level: "中級",
            target: "大腿四頭筋・大殿筋",
            desc: "後ろ足を台に乗せて行う片足スクワット。バランス力と片脚ずつの筋力強化に効果的。",
            image: "/images/muscles/bulgarian-split-squat.png",
        },
        {
            name: "ルーマニアンデッドリフト",
            level: "中級",
            target: "ハムストリングス・大殿筋",
            desc: "膝を軽く曲げたまま股関節を折りたたむデッドリフト。ハムストリングスを強くストレッチしながら鍛えられる。",
            image: "/images/muscles/romanian-deadlift.png",
        },
    ],
    "腹筋": [
        {
            name: "クランチ",
            level: "初級",
            target: "腹直筋上部",
            desc: "上体を丸めて起こす基本の腹筋種目。腹直筋上部を集中的に鍛える。",
            image: "/images/muscles/crunch.png",
        },
        {
            name: "レッグレイズ",
            level: "初級",
            target: "腹直筋下部",
            desc: "仰向けで脚を上げ下げする種目。腹筋下部に効果的。",
        },
        {
            name: "プランク",
            level: "初級",
            target: "腹直筋・体幹全体",
            desc: "腕とつま先で体を支える静的種目。体幹の安定性を高める。",
        },
        {
            name: "ロシアンツイスト",
            level: "初級",
            target: "腹斜筋",
            desc: "座った姿勢で体をひねる種目。脇腹の腹斜筋を鍛える。",
        },
        {
            name: "バイシクルクランチ",
            level: "中級",
            target: "腹直筋・腹斜筋",
            desc: "自転車を漕ぐように体をひねりながら行うクランチ。腹筋全体に効かせられる。",
            image: "/images/muscles/bicycle-crunch.png",
        },
        {
            name: "ハンギングレッグレイズ",
            level: "上級",
            target: "腹直筋下部・腹斜筋",
            desc: "懸垂バーにぶら下がって脚を上げる高強度の種目。下腹部に強い負荷がかかる。",
            image: "/images/muscles/hanging-leg-raise.png",
        },
        {
            name: "アブローラー",
            level: "上級",
            target: "腹直筋・体幹全体",
            desc: "ローラーを転がしながら体を伸縮させる種目。腹筋だけでなく体幹全体に強い負荷がかかる高強度種目。",
            image: "/images/muscles/ab-roller.png",
        },
    ],
}

export const allExercises = [
    ...chestExercises.map(ex => ({ ...ex, category: "胸" })),
    ...Object.entries(otherExercises).flatMap(([category, list]) =>
        list.map(ex => ({ ...ex, category }))
    ),
]

const ExerciseThumb = ({ src, alt, color, size = "5.6rem" }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: "1rem",
        background: `${color}14`,
        overflow: "hidden",
        flexShrink: 0,
    }}>
        <img
            src={src}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
    </div>
)

const ExercisesPage = () => {
    const [activeTab, setActiveTab] = useState("胸")
    const activeColor = categories.find(cat => cat.name === activeTab)?.color ?? "#9ca3af"
    const currentExercises = activeTab === "胸" ? chestExercises : (otherExercises[activeTab] || [])

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

            <div style={{
                background: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "1.5rem",
                padding: "2.5rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid #f5f5f5",
                }}>
                    <p style={{ fontSize: "2rem", fontWeight: "700", color: "#333", margin: 0 }}>
                        {activeTab}
                    </p>
                    <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: 0 }}>
                        {currentExercises.length}種目
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {currentExercises.map((ex, i) => (
                        <Link
                            key={ex.name}
                            href={`/exercises/${encodeURIComponent(ex.name)}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1.4rem",
                                justifyContent: "space-between",
                                padding: "1.4rem 0",
                                borderBottom: i < currentExercises.length - 1 ? "1px solid #f9fafb" : "none",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <ExerciseThumb src={ex.image || muscleImages[activeTab]} alt={ex.name} color={activeColor} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.4rem" }}>
                                    <p style={{ fontSize: "1.5rem", color: "#333", margin: 0, fontWeight: "600" }}>
                                        {ex.name}
                                    </p>
                                    <span style={{
                                        fontSize: "1.1rem",
                                        fontWeight: "600",
                                        color: levelColor[ex.level],
                                        background: `${levelColor[ex.level]}20`,
                                        padding: "0.2rem 0.8rem",
                                        borderRadius: "10rem",
                                    }}>
                                        {ex.level}
                                    </span>
                                </div>
                                <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: 0 }}>
                                    {ex.target}
                                </p>
                            </div>
                            <ChevronRight size={18} color="#9ca3af" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExercisesPage
