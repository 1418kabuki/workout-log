"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { allExercises, muscleImages } from "../page"

const youtubeSearches = {
    "ベンチプレス": [
        { title: "ベンチプレスの正しいフォーム解説", query: "ベンチプレス 正しいフォーム 解説" },
        { title: "ベンチプレス 重量を伸ばすコツ", query: "ベンチプレス 重量 伸ばす コツ" },
        { title: "ベンチプレス よくある間違い", query: "ベンチプレス よくある間違い 初心者" },
    ],
    "インクラインベンチプレス": [
        { title: "インクラインベンチプレスの角度と効かせ方", query: "インクラインベンチプレス 角度 フォーム" },
        { title: "大胸筋上部の鍛え方", query: "大胸筋 上部 鍛え方 インクライン" },
    ],
    "ダンベルフライ": [
        { title: "ダンベルフライの正しいフォーム", query: "ダンベルフライ 正しいフォーム 解説" },
        { title: "ダンベルフライ ストレッチの効かせ方", query: "ダンベルフライ ストレッチ 大胸筋" },
    ],
    "ケーブルクロスオーバー": [
        { title: "ケーブルクロスオーバーの使い方", query: "ケーブルクロスオーバー フォーム 解説" },
        { title: "大胸筋内側を鍛える方法", query: "大胸筋 内側 ケーブル 仕上げ" },
    ],
    "プッシュアップ": [
        { title: "プッシュアップで大胸筋に効かせるコツ", query: "プッシュアップ 大胸筋 効かせ方 フォーム" },
        { title: "プッシュアップのバリエーション", query: "プッシュアップ バリエーション 種類" },
    ],
    "ディップス": [
        { title: "ディップスで大胸筋に効かせる方法", query: "ディップス 大胸筋 効かせ方 前傾" },
        { title: "ディップスの正しいフォーム", query: "ディップス フォーム 解説 初心者" },
    ],
    "チェストマシンプレス": [
        { title: "チェストマシンプレスの正しいフォーム", query: "チェストマシンプレス フォーム 解説" },
        { title: "大胸筋に効かせるコツ", query: "チェストマシンプレス 大胸筋 効かせ方" },
    ],
    "デッドリフト": [
        { title: "デッドリフトの正しいフォーム解説", query: "デッドリフト 正しいフォーム 解説" },
        { title: "デッドリフト よくある間違い", query: "デッドリフト よくある間違い 初心者" },
    ],
    "懸垂": [
        { title: "懸垂ができるようになる方法", query: "懸垂 できない 練習方法" },
        { title: "懸垂の正しいフォーム", query: "懸垂 正しいフォーム 広背筋" },
    ],
    "ラットプルダウン": [
        { title: "ラットプルダウンの正しいフォーム", query: "ラットプルダウン フォーム 解説" },
        { title: "広背筋に効かせるコツ", query: "ラットプルダウン 広背筋 効かせ方" },
    ],
    "ベントオーバーローイング": [
        { title: "ベントオーバーローイングの正しいフォーム", query: "ベントオーバーローイング フォーム 解説" },
        { title: "背中の厚みを作るコツ", query: "ベントオーバーローイング 背中 厚み コツ" },
    ],
    "シーテッドローイング": [
        { title: "シーテッドローイングの正しいフォーム", query: "シーテッドローイング フォーム 解説" },
        { title: "背中に効かせるポイント", query: "シーテッドローイング 背中 効かせ方" },
    ],
    "ワンハンドローイング": [
        { title: "ワンハンドローイングの正しいフォーム", query: "ワンハンドローイング フォーム 解説" },
        { title: "広背筋に効かせるコツ", query: "ワンハンドローイング 広背筋 効かせ方" },
    ],
    "ショルダーマシンプレス": [
        { title: "ショルダーマシンプレスの正しいフォーム", query: "ショルダーマシンプレス フォーム 解説" },
        { title: "肩を痛めないコツ", query: "ショルダーマシンプレス 肩 痛め ない コツ" },
    ],
    "スミスマシンプレス": [
        { title: "スミスマシンプレスの正しいフォーム", query: "スミスマシンプレス フォーム 解説" },
        { title: "肩に効かせるコツ", query: "スミスマシンプレス 三角筋 効かせ方" },
    ],
    "ダンベルプレス": [
        { title: "ダンベルショルダープレスの正しいフォーム", query: "ダンベルプレス 肩 フォーム 解説" },
        { title: "可動域を広く使うコツ", query: "ダンベルプレス 肩 可動域 コツ" },
    ],
    "サイドレイズ": [
        { title: "サイドレイズの正しいフォーム", query: "サイドレイズ フォーム 解説" },
        { title: "三角筋中部に効かせるコツ", query: "サイドレイズ 三角筋 効かせ方" },
    ],
    "フロントレイズ": [
        { title: "フロントレイズの正しいフォーム", query: "フロントレイズ フォーム 解説" },
        { title: "肩の前部に効かせるコツ", query: "フロントレイズ 三角筋前部 効かせ方" },
    ],
    "リアレイズ": [
        { title: "リアレイズの正しいフォーム", query: "リアレイズ フォーム 解説" },
        { title: "肩の後部に効かせるコツ", query: "リアレイズ 三角筋後部 効かせ方" },
    ],
    "アーノルドプレス": [
        { title: "アーノルドプレスの正しいフォーム", query: "アーノルドプレス フォーム 解説" },
        { title: "肩全体に効かせるコツ", query: "アーノルドプレス 三角筋 効かせ方" },
    ],
    "フェイスプル": [
        { title: "フェイスプルの正しいフォーム", query: "フェイスプル フォーム 解説" },
        { title: "肩甲骨まわりに効かせるコツ", query: "フェイスプル 肩甲骨 効かせ方" },
    ],
    "バーベルカール": [
        { title: "バーベルカールの正しいフォーム", query: "バーベルカール フォーム 解説" },
        { title: "上腕二頭筋に効かせるコツ", query: "バーベルカール 上腕二頭筋 効かせ方" },
    ],
    "ハンマーカール": [
        { title: "ハンマーカールの正しいフォーム", query: "ハンマーカール フォーム 解説" },
        { title: "前腕にも効かせるコツ", query: "ハンマーカール 前腕 効かせ方" },
    ],
    "トライセプスプレスダウン": [
        { title: "トライセプスプレスダウンの正しいフォーム", query: "トライセプスプレスダウン フォーム 解説" },
        { title: "上腕三頭筋に効かせるコツ", query: "トライセプスプレスダウン 上腕三頭筋 効かせ方" },
    ],
    "フレンチプレス": [
        { title: "フレンチプレスの正しいフォーム", query: "フレンチプレス フォーム 解説" },
        { title: "三頭筋長頭に効かせるコツ", query: "フレンチプレス 上腕三頭筋 長頭 効かせ方" },
    ],
    "コンセントレーションカール": [
        { title: "コンセントレーションカールの正しいフォーム", query: "コンセントレーションカール フォーム 解説" },
        { title: "二頭筋の収縮を高めるコツ", query: "コンセントレーションカール 効かせ方" },
    ],
    "スカルクラッシャー": [
        { title: "スカルクラッシャーの正しいフォーム", query: "スカルクラッシャー フォーム 解説" },
        { title: "肘を痛めないコツ", query: "スカルクラッシャー 肘 痛めない コツ" },
    ],
    "インクラインダンベルカール": [
        { title: "インクラインダンベルカールの正しいフォーム", query: "インクラインダンベルカール フォーム 解説" },
        { title: "二頭筋のストレッチを効かせるコツ", query: "インクラインダンベルカール 効かせ方" },
    ],
    "ダンベルキックバック": [
        { title: "ダンベルキックバックの正しいフォーム", query: "ダンベルキックバック フォーム 解説" },
        { title: "三頭筋に効かせるコツ", query: "ダンベルキックバック 上腕三頭筋 効かせ方" },
    ],
    "スクワット": [
        { title: "スクワットの正しいフォーム解説", query: "スクワット 正しいフォーム 解説" },
        { title: "スクワット よくある間違い", query: "スクワット よくある間違い 初心者" },
    ],
    "レッグマシンプレス": [
        { title: "レッグマシンプレスの正しいフォーム", query: "レッグマシンプレス フォーム 解説" },
        { title: "足の位置による違い", query: "レッグマシンプレス 足幅 位置 違い" },
    ],
    "ランジ": [
        { title: "ランジの正しいフォーム", query: "ランジ フォーム 解説" },
        { title: "ランジのバリエーション", query: "ランジ バリエーション 種類" },
    ],
    "レッグカール": [
        { title: "レッグカールの正しいフォーム", query: "レッグカール フォーム 解説" },
        { title: "ハムストリングスに効かせるコツ", query: "レッグカール ハムストリングス 効かせ方" },
    ],
    "レッグエクステンション": [
        { title: "レッグエクステンションの正しいフォーム", query: "レッグエクステンション フォーム 解説" },
        { title: "膝を痛めないコツ", query: "レッグエクステンション 膝 痛めない コツ" },
    ],
    "カーフレイズ": [
        { title: "カーフレイズの正しいフォーム", query: "カーフレイズ フォーム 解説" },
        { title: "ふくらはぎに効かせるコツ", query: "カーフレイズ ふくらはぎ 効かせ方" },
    ],
    "ブルガリアンスクワット": [
        { title: "ブルガリアンスクワットの正しいフォーム", query: "ブルガリアンスクワット フォーム 解説" },
        { title: "バランスを取るコツ", query: "ブルガリアンスクワット バランス コツ" },
    ],
    "ルーマニアンデッドリフト": [
        { title: "ルーマニアンデッドリフトの正しいフォーム", query: "ルーマニアンデッドリフト フォーム 解説" },
        { title: "ハムストリングスに効かせるコツ", query: "ルーマニアンデッドリフト ハムストリングス 効かせ方" },
    ],
    "クランチ": [
        { title: "クランチの正しいフォーム", query: "クランチ フォーム 解説" },
        { title: "腹直筋上部に効かせるコツ", query: "クランチ 腹直筋 効かせ方" },
    ],
    "レッグレイズ": [
        { title: "レッグレイズの正しいフォーム", query: "レッグレイズ フォーム 解説" },
        { title: "腰を痛めないコツ", query: "レッグレイズ 腰 痛めない コツ" },
    ],
    "プランク": [
        { title: "プランクの正しいフォーム", query: "プランク フォーム 解説" },
        { title: "プランクのバリエーション", query: "プランク バリエーション 種類" },
    ],
    "ロシアンツイスト": [
        { title: "ロシアンツイストの正しいフォーム", query: "ロシアンツイスト フォーム 解説" },
        { title: "腹斜筋に効かせるコツ", query: "ロシアンツイスト 腹斜筋 効かせ方" },
    ],
    "バイシクルクランチ": [
        { title: "バイシクルクランチの正しいフォーム", query: "バイシクルクランチ フォーム 解説" },
        { title: "腹筋全体に効かせるコツ", query: "バイシクルクランチ 効かせ方" },
    ],
    "ハンギングレッグレイズ": [
        { title: "ハンギングレッグレイズの正しいフォーム", query: "ハンギングレッグレイズ フォーム 解説" },
        { title: "反動を使わないコツ", query: "ハンギングレッグレイズ 反動 使わない コツ" },
    ],
    "アブローラー": [
        { title: "アブローラーの正しいフォーム", query: "アブローラー フォーム 解説" },
        { title: "腰を痛めないコツ", query: "アブローラー 腰 痛めない コツ" },
    ],
}

const levelColor = {
    "初級": "#34D399",
    "中級": "#FFD873",
    "上級": "#FF63A4",
}

const ExerciseDetailPage = () => {
    const { name } = useParams()
    const router = useRouter()
    const decodedName = decodeURIComponent(name)

    const exercise = allExercises.find(ex => ex.name === decodedName)
    const videos = youtubeSearches[decodedName] || []

    if (!exercise) {
        return (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
                <p style={{ fontSize: "1.6rem", color: "#9ca3af" }}>種目が見つかりませんでした</p>
            </div>
        )
    }

    return (
        <div>
            {/* 戻るボタン */}
            <button
                onClick={() => router.back()}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "none",
                    border: "none",
                    fontSize: "1.4rem",
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: 0,
                    marginBottom: "2rem",
                }}
            >
                <ArrowLeft size={18} />
                種目一覧に戻る
            </button>

            {/* 種目名・バッジ */}
            <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.8rem" }}>
                    <h1 style={{ fontSize: "2.9rem", fontWeight: "700", margin: 0, color: "#222" }}>
                        {exercise.name}
                    </h1>
                    <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        color: levelColor[exercise.level],
                        background: `${levelColor[exercise.level]}20`,
                        padding: "0.3rem 1rem",
                        borderRadius: "10rem",
                    }}>
                        {exercise.level}
                    </span>
                </div>
                <p style={{ fontSize: "1.3rem", color: "#9ca3af", margin: 0 }}>
                    対象部位：{exercise.target}
                </p>
            </div>

            {/* 画像 */}
            <div style={{
                width: "100%",
                height: "26rem",
                borderRadius: "1.6rem",
                overflow: "hidden",
                marginBottom: "2.5rem",
                background: "#fafafa",
                border: "1px solid #f0f0f0",
            }}>
                <img
                    src={exercise.image || muscleImages[exercise.category]}
                    alt={exercise.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
            </div>

            {/* 説明 */}
            <div style={{
                background: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "1.5rem",
                padding: "2.5rem",
                marginBottom: "2.5rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: "0 0 1.2rem" }}>
                    種目について
                </h2>
                <p style={{ fontSize: "1.5rem", color: "#555", margin: 0, lineHeight: "1.8" }}>
                    {exercise.desc}
                </p>
            </div>

            {/* YouTube動画 */}
            {videos.length > 0 && (
                <div style={{
                    background: "white",
                    border: "1px solid #f0f0f0",
                    borderRadius: "1.6rem",
                    padding: "2.5rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: "0 0 1.5rem" }}>
                        おすすめ動画
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {videos.map((v, i) => (
                            <a
                                key={i}
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "1.4rem 1.8rem",
                                    background: "#fafafa",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "1rem",
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    <div style={{
                                        width: "3.6rem",
                                        height: "3.6rem",
                                        background: "#FF0000",
                                        borderRadius: "0.8rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.6rem",
                                        flexShrink: 0,
                                    }}>
                                        ▶
                                    </div>
                                    <p style={{ fontSize: "1.4rem", fontWeight: "500", color: "#333", margin: 0 }}>
                                        {v.title}
                                    </p>
                                </div>
                                <ExternalLink size={16} color="#9ca3af" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExerciseDetailPage
