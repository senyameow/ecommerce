import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const body = await req.json()

        const { name } = body

        if (!name) return new NextResponse('No name provided', { status: 400 })

        const store = await db.store.create({
            data: {
                name,
                userId,
            }
        })

        return NextResponse.json(store, { status: 200 })

    } catch (error) {
        return new NextResponse('internal error', { status: 500 })
    }
}