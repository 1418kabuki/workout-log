import Link from "next/link"
import Image from "next/image"

const getAllDatas = async () => {
    const response = await fetch("http://localhost:3000/api/menu/readall")
    const jsonData = await response.json()
    const allDatas = jsonData.data
    return allDatas
}

export const dynamic = "force-dynamic"

const ReadAllDatas = async () => {
    const allDatas = await getAllDatas()
    return (
        <div className="grid-container-in">
            {allDatas.map(data =>
                <Link href={`/menu/readsingle/${data.id}`} key={data.id}>
                    <Image src={data.image} width={750} height={500} alt="data-image" priority />
                    <div>
                        <h2>{data.exercise}</h2>
                        <h3>{data.weight}kg</h3>
                        <h3>{data.reps}回</h3>
                        <p>{data.memo.substring(0, 80)}...</p>
                    </div>
                </Link>
            )}
        </div>
    )
}

export default ReadAllDatas