

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        if (!params.sizeId) return new NextResponse('No store id provided', { status: 400 })

        const size = await db.size.findUnique({
            where: {
                id: params.sizeId,
                storeId: storeId as string,
            }
        })

        return NextResponse.json(size, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

