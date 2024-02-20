

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {


        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        if (!params.billboardId) return new NextResponse('No store id provided', { status: 400 })

        const billboard = await db.billboard.findUnique({
            where: {
                id: params.billboardId,
                storeId: storeId as string
            }
        })

        return NextResponse.json(billboard, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

