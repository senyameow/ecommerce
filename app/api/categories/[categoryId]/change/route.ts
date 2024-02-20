import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function PATCH(req: Request, { params }: { params: { categoryId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        if (!params.categoryId) return new NextResponse('no store ID', { status: 400 })

        const { label } = await req.json()

        if (!label) return new NextResponse('no label provided', { status: 403 })

        const category = await db.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                label,
            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(category, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}