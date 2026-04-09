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

    const menuStyle = {
        background: "none",
        border: "none",
        padding: "5px 10px",
        font: "inherit",
        cursor: "pointer",
        color: "inherit",
        display: "block",
        textDecoration: "none"
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
                            <li><button onClick={handleLogout} style={menuStyle}>ログアウト</button></li>
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