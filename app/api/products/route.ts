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
        if (!color) return new NextResponse('No color provided', { status: 400 })
        if (!storeId) return new NextResponse('No store id provided', { status: 400 })



        const product = await db.product.create({
            data: {
                label,
                categoryId: category,
                colorId: color,
                sizeId: size,
                price: price,
                isFeatured,
                isArchived,
                storeId: storeId as string,

                Image: {
                    create: {
                        url: image_url
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

        return NextResponse.json(product, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

export async function GET(req: Request) {
    try {


        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const categoryId = searchParams.get('categoryId') || undefined
        const isFeatured = searchParams.get('isFeatured')



        if (!storeId) return new NextResponse('No store id provided', { status: 400 })



        const products = await db.product.findMany({
            where: {
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                Color: true,
                Size: true,
                Category: true,
                Image: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        })


        return NextResponse.json(products, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

