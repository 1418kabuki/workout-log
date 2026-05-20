import Image from "next/image"
import Link from "next/link"
import prisma from '@/lib/prisma'

const getSingleData = async (id) => {
    const singleData = await prisma.workoutLog.findUnique({
        where: { id: Number(id) }
    })
    return singleData
}

const ReadSingleData = async (context) => {
    const params = await context.params
    const singleData = await getSingleData(params.id)

    return (
        <div className="grid-container-si">
            <div>
                {singleData.image && <Image src={singleData.image} width={750} height={500} alt="data-image" priority />}
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
