import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        if (!params.productId) return new NextResponse('no store ID', { status: 400 })

        const { label, category, size, price, isFeatured, isArchived, color } = await req.json()


        if (!label) return new NextResponse('No label provided', { status: 400 })
        if (!category) return new NextResponse('No catefory provided', { status: 400 })
        if (!size) return new NextResponse('No size provided', { status: 400 })
        if (!price) return new NextResponse('No price provided', { status: 400 })
        if (!color) return new NextResponse('No color provided', { status: 400 })
        if (!params.productId) return new NextResponse('No store id provided', { status: 400 })

        if (!label) return new NextResponse('bo label provided', { status: 403 })

        const product = await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                label,
                categoryId: category,
                sizeId: size,
                price,
                isArchived,
                isFeatured,
                colorId: color,

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