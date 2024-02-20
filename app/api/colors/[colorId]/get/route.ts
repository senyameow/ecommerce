

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        if (!params.colorId) return new NextResponse('No store id provided', { status: 400 })

        const color = await db.color.findUnique({
            where: {
                id: params.colorId,
                storeId: storeId as string,
            }
        })

        return NextResponse.json(color, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

