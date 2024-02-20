import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const product = await db.product.delete({
            where: {
                id: params.productId,

            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(product, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}