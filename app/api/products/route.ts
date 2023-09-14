import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        const { label, image_url, category, size, price, isFeatured, isArchived, color } = await req.json()


        if (!label) return new NextResponse('No label provided', { status: 400 })
        if (!image_url) return new NextResponse('No image provided', { status: 400 })
        if (!category) return new NextResponse('No catefory provided', { status: 400 })
        if (!size) return new NextResponse('No size provided', { status: 400 })
        if (!price) return new NextResponse('No price provided', { status: 400 })
        if (!isFeatured) return new NextResponse('No data provided', { status: 400 })
        if (!isArchived) return new NextResponse('No data provided', { status: 400 })
        if (!color) return new NextResponse('No color provided', { status: 400 })
        if (!storeId) return new NextResponse('No store id provided', { status: 400 })



        const product = await db.product.create({
            data: {
                label,

                storeId: storeId as string,
                Image: {
                    createMany: {
                        data: [
                            ...im
                        ]
                    }
                }
            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId,
                id: storeId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(billboard, { status: 200 })

    } catch (error) {
        console.log('CREATE_BILLBOARD_ERROR', error)
        return new NextResponse('internal error', { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')



        if (!storeId) return new NextResponse('No store id provided', { status: 400 })



        const billboards = await db.billboard.findMany({
            where: {
                storeId
            }
        })


        return NextResponse.json(billboards, { status: 200 })

    } catch (error) {
        console.log('GET_BILLBOARD_ERROR', error)
        return new NextResponse('internal error', { status: 500 })
    }
}

