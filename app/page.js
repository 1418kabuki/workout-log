"use client"

import Link from "next/link"

const steps = [
    { num: "1", title: "記録する", desc: "種目・重量・回数を入力するだけ。複数種目もまとめて1回で保存できる。" },
    { num: "2", title: "グラフで見る", desc: "種目ごとの重量推移や、ワークアウト頻度を自動でグラフ化。" },
    { num: "3", title: "種目ライブラリ", desc: "部位別に整理された種目一覧から、正しいフォームをすぐ確認できる。" },
]

const heroStats = [
    { label: "総トレーニング回数", value: "128", unit: "回" },
    { label: "総ボリューム", value: "42.3", unit: "t" },
    { label: "連続記録日数", value: "6", unit: "日" },
]

const LandingPage = () => {
    const handleDemo = async () => {
        const res = await fetch("/api/user/demo", { method: "POST" })
        const { token } = await res.json()
        localStorage.setItem("token", token)
        window.location.href = "/home"
    }

    return (
        <div>
            {/* Hero */}
            <div className="pt-[5rem] pb-[2rem] text-center">
                <h1 className="mb-[1.8rem] text-[4.2rem] font-bold leading-[1.25] text-foreground">
                    日々のトレーニングを<span className="text-primary">記録</span>して<br />
                    <span className="text-primary">成長</span>を実感しよう
                </h1>

                <p className="mx-auto mb-[3rem] max-w-[44rem] text-[1.6rem] font-normal leading-[1.8] text-[#383c42]">
                    日々のトレーニングを記録するだけで、重量の推移や継続日数を自動でグラフ化。
                    <br />次の一歩がはっきり見えるようになります。
                </p>

                <div className="mb-[4.5rem] flex flex-wrap justify-center gap-[1.2rem]">
                    <Link
                        href="/user/register"
                        className="rounded-[10rem] bg-gradient-to-br from-[#FF63A4] to-[#FFD873] px-[3.2rem] py-[1.3rem] text-[1.6rem] font-bold text-white no-underline shadow-[0_8px_24px_rgba(255,99,164,0.28)]"
                    >
                        無料で始める
                    </Link>
                    <button
                        onClick={handleDemo}
                        className="w-auto cursor-pointer rounded-[10rem] border-[1.5px] border-border bg-white px-[3.2rem] py-[1.3rem] text-[1.6rem] font-semibold text-[#333]"
                    >
                        デモを見る
                    </button>
                </div>

                {/* Hero visual: 実際の画面をイメージしたプレビュー */}
                <div className="mx-auto max-w-[72rem] rounded-[2.2rem] border border-border bg-white p-[3.6rem] text-left shadow-[0_24px_60px_rgba(0,0,0,0.09)]">
                    <div className="mb-[2rem] flex items-center justify-between">
                        <p className="m-0 text-[1.6rem] font-bold text-[#333]">
                            ベンチプレス の重量推移
                        </p>
                        <span className="rounded-[10rem] bg-[rgba(52,211,153,0.1)] px-[1rem] py-[0.4rem] text-[1.2rem] font-semibold text-[#34D399]">
                            +22.5kg / 半年
                        </span>
                    </div>

                    <svg viewBox="0 0 400 110" className="h-auto w-full">
                        <defs>
                            <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#FF63A4" />
                                <stop offset="100%" stopColor="#FFD873" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="95" x2="400" y2="95" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1="55" x2="400" y2="55" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1="15" x2="400" y2="15" stroke="#f0f0f0" strokeWidth="1" />
                        <polyline
                            points="10,95 75,82 140,78 205,52 270,38 380,12"
                            fill="none"
                            stroke="url(#heroLineGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {[[10, 95], [75, 82], [140, 78], [205, 52], [270, 38], [380, 12]].map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#FF63A4" strokeWidth="2" />
                        ))}
                    </svg>

                    <div className="landing-hero-stats mt-[1.8rem] border-t border-[#f5f5f5] pt-[1.8rem]">
                        {heroStats.map(s => (
                            <div key={s.label}>
                                <p className="m-0 mb-[0.3rem] text-[1.1rem] text-muted-foreground">{s.label}</p>
                                <p className="m-0 text-[1.8rem] font-bold text-[#333]">
                                    {s.value}
                                    <span className="text-[1.1rem] font-normal text-muted-foreground"> {s.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-[10rem] pb-[9rem]">
                <h2 className="mb-[4rem] text-center text-[3.6rem] font-bold text-foreground">
                    便利な3つの機能
                </h2>
                <div className="landing-3col-grid">
                    {steps.map(s => (
                        <div key={s.num} className="rounded-[1.8rem] bg-white px-[2.6rem] py-[3.4rem] text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                            <div className="mx-auto mb-[1.6rem] flex size-[5.6rem] items-center justify-center rounded-full bg-primary text-[2.6rem] font-bold text-white">
                                {s.num}
                            </div>
                            <p className="mb-[0.8rem] text-[2rem] font-bold text-[#333]">
                                {s.title}
                            </p>
                            <p className="text-[1.5rem] font-normal leading-[1.7] text-[#383c42]">
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="mb-[2rem] rounded-[2rem] border border-border bg-[#fff0f4] px-[2.5rem] py-[4rem] text-center">
                <h2 className="mb-[2.5rem] text-[2.2rem] font-bold text-[#333]">
                    継続して成長を実感しよう
                </h2>
                <div className="flex flex-wrap justify-center gap-[1.2rem]">
                    <Link
                        href="/user/register"
                        className="inline-block rounded-[10rem] bg-gradient-to-br from-[#FF63A4] to-[#FFD873] px-[4rem] py-[1.2rem] text-[1.6rem] font-bold text-white no-underline shadow-[0_4px_16px_rgba(255,99,164,0.3)]"
                    >
                        無料で始める
                    </Link>
                    <button
                        onClick={handleDemo}
                        className="inline-block w-auto cursor-pointer rounded-[10rem] border-[1.5px] border-border bg-white px-[4rem] py-[1.2rem] text-[1.6rem] font-semibold text-[#333]"
                    >
                        デモを見る
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
