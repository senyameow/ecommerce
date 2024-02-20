import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function DELETE(req: Request, { params }: { params: { colorId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        const color = await db.color.delete({
            where: {
                id: params.colorId,
                storeId: storeId as string,

            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(color, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}