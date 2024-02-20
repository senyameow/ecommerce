import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = searchParams.get('storeId')

        const { label, image_url } = await req.json()


        if (!label) return new NextResponse('No label provided', { status: 400 })
        if (!image_url) return new NextResponse('No image provided', { status: 400 })
        if (!storeId) return new NextResponse('No store id provided', { status: 400 })

        const billboard = await db.billboard.create({
            data: {
                label,
                image_url,
                storeId: storeId as string,
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
        return new NextResponse('internal error', { status: 500 })
    }
}

