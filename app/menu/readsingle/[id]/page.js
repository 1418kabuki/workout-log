import Image from "next/image"
import Link from "next/link"
import prisma from '@/lib/prisma'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
        <div className="grid gap-[2rem] md:grid-cols-[0.6fr_0.4fr]">
            <Card className="gap-0 overflow-hidden rounded-[1.6rem] p-0 shadow-md ring-0">
                {singleData.image && (
                    <Image src={singleData.image} width={750} height={500} alt="data-image" priority className="h-auto w-full" />
                )}
            </Card>
            <div>
                <h1 className="mb-[0.4rem] text-[2rem] font-bold text-foreground">{singleData.exercise}</h1>
                <h2 className="mb-[0.2rem] text-[1.6rem] font-semibold text-primary">{singleData.weight}kg</h2>
                <h2 className="mb-[1.5rem] text-[1.6rem] font-semibold text-primary">{singleData.reps}回</h2>
                <hr className="mb-[1.5rem] border-border" />
                <p className="mb-[2rem] text-[1.4rem] text-[#383c42]">{singleData.memo}</p>
                <div className="flex gap-[1rem]">
                    <Button variant="outline" asChild>
                        <Link href={`/menu/update/${singleData.id}`}>メニュー編集</Link>
                    </Button>
                    <Button variant="destructive" asChild>
                        <Link href={`/menu/delete/${singleData.id}`}>メニュー削除</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ReadSingleData
