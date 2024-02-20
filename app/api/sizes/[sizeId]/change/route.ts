import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function PATCH(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        if (!params.sizeId) return new NextResponse('no store ID', { status: 400 })

        const { label, value } = await req.json()

        if (!label) return new NextResponse('no label provided', { status: 403 })

        const size = await db.size.update({
            where: {
                id: params.sizeId,
            },
            data: {
                label,
                value,
            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(size, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}