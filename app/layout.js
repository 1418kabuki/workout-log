import "./globals.css"
import Header from "./components/header"
import BottomNav from "./components/bottom-nav"

const RootLayout = ({ children }) => {
    return (
        <html lang="ja">
            <body>
                <Header />
                <main style={{ paddingBottom: "7rem" }}>
                    {children}
                </main>
                <BottomNav />
            </body>
        </html>
    )
}

export default RootLayout
