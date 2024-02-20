

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        if (!params.productId) return new NextResponse('No store id provided', { status: 400 })

        const product = await db.product.findUnique({
            where: {
                id: params.productId,
                storeId: storeId as string
            },
            include: {
                Image: true,
                Color: true,
                Size: true,
                Category: true,
            }
        })

        return NextResponse.json(product, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

