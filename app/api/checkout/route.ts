import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request) {
    try {

        const { searchParams } = new URL(req.url)
        const storeId = searchParams.get('storeId')

        const body = await req.json()
        const { productIds } = body

        if (productIds.length === 0) return new NextResponse('no product ids provided', { status: 400 })

        const purchasedItems = await db.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        })

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

        purchasedItems.forEach(product => {
            lineItems.push({
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: product?.label
                    },
                    unit_amount: Number(product.price) * 100
                },
                quantity: 1,

            })
        })

        const order = await db.order.create({
            data: {
                storeId: storeId as string,
                OrderItem: {
                    create: productIds.map((id: string) => ({
                        Product: {
                            connect: {
                                id
                            }
                        }
                    }))
                }
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=123`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=123`,
            phone_number_collection: {
                enabled: true
            },
            billing_address_collection: 'required',
            metadata: {
                orderId: order.id
            }
        })

        return NextResponse.json({ url: session.url }, {
            headers: corsHeaders
        })

    } catch (error) {
    }
}