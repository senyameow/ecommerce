

import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
    try {

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        if (!params.categoryId) return new NextResponse('No store id provided', { status: 400 })

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId,
                storeId: storeId as string
            }
        })

        return NextResponse.json(category, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

