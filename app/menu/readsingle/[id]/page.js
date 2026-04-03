import Image from "next/image"
import Link from "next/link"

const getSingleData = async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/menu/readsingle/${id}`)
    const jsonData = await response.json()
    const singleData = jsonData.data
    return singleData
}

const ReadSingleData = async (context) => {
    const params = await context.params
    const singleData = await getSingleData(params.id)

    return (
        <div className="grid-container-si">
            <div>
                <Image src={singleData.image} width={750} height={500} alt="data-image" priority />
            </div>
            <div>
                <h1>{singleData.exercise}</h1>
                <h2>{singleData.weight}kg</h2>
                <h2>{singleData.reps}回</h2>
                <hr />
                <p>{singleData.memo}</p>
            </div>
            <div>
                <Link href={`/menu/update/${singleData.id}`}>メニュー編集</Link>
                <Link href={`/menu/delete/${singleData.id}`}>メニュー削除</Link>
            </div>
        </div>
    )

}

export default ReadSingleData