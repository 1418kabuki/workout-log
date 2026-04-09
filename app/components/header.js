"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        alert("ログアウトしました")
        router.push("/user/login")
    }

    const logoutButtonStyle = {
        background: "none",
        border: "none",
        padding: "0",        // Linkに余計なパディングがないなら0にする
        font: "inherit",     // 親要素のフォントを継承
        cursor: "pointer",
        color: "inherit",    // 文字色を合わせる
        textDecoration: "none",
        display: "inline",   // Link（aタグ）と同じインライン要素にする
    }


    return (
        <header>
            <div>
                <Link href="/">
                    <Image src="/header.svg" width={1330} height={148} alt="header-image" priority />
                </Link>
            </div>
            <nav>
                <ul>
                    {isLoggedIn ? (
                        <>
                            <li><Link href="/menu/create">記録作成</Link></li>
                            <li><button onClick={handleLogout} style={logoutButtonStyle}>ログアウト</button></li>
                            {/* <li><Link href="/menu/create">メニュー作成</Link></li> */}
                        </>
                    ) : (
                        <>
                            <li><Link href="/user/register">登録</Link></li>
                            <li><Link href="/user/login">ログイン</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header