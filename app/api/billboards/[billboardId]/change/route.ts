import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function PATCH(req: Request, { params }: { params: { billboardId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        if (!params.billboardId) return new NextResponse('no store ID', { status: 400 })

        const { label, image_url } = await req.json()

        if (!label) return new NextResponse('bo label provided', { status: 403 })
        if (!image_url) return new NextResponse('bo image provided', { status: 403 })

        const billboard = await db.billboard.update({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                image_url
            }
        })

        const storeByUserId = await db.store.findFirst({
            where: {
                userId
            }
        })

        if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 })

        return NextResponse.json(billboard, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}