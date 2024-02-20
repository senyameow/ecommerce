import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function DELETE(req: Request) {
    try {
        const { userId } = auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)

        const storeId = (searchParams.get('storeId')) as string

        const store = await db.store.delete({
            where: {
                id: storeId,
                userId
            }
        })

        return NextResponse.json(store, { status: 200 })


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}