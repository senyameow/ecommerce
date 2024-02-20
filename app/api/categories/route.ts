import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const body = await req.json()

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        const { label, billboardId } = body

        if (!label) return new NextResponse('No name provided', { status: 400 })

        const category = await db.category.create({
            data: {
                label,
                storeId: storeId as string,
                billboardId

            }
        })

        return NextResponse.json(category, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url)
        const storeId = searchParams.get('storeId')

        if (!storeId) return new NextResponse(`no store id provided`, { status: 401 })

        const categories = await db.category.findMany({
            where: {
                storeId
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return NextResponse.json(categories, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}