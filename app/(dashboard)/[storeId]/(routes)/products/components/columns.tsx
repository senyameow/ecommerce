"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Action } from "./Action"
import { Category, Color, Image, Size } from "@prisma/client"
import { Check, X } from "lucide-react"
import { useEffect } from "react"
import { db } from "@/lib/db"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: string
    label: string
    price: string;
    isFeatured: boolean;
    isArchived: boolean;
    priceToModal: string;

    category: Category;
    size: Size;
    color: Color;

    created_at: string
}



export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "label",
        header: "Name",
    },
    {
        accessorKey: "isArchieved",
        header: "Archieved",
        cell: (table) => <span className="">{table.row.original.isArchived === false ? <X className="w-6 h-6 text-rose-500" /> : <Check className="w-6 h-6 text-green-500" />}</span>
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: (table) => <span>{table.row.original.isFeatured === false ? <X className="w-6 h-6 text-rose-500" /> : <Check className="w-6 h-6 text-green-500" />}</span>
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: (table) => <span>{(table.row.original.price + '')}</span>
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: (table) => <span>{table.row.original.category.label}</span>
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: (table) => <span>{table.row.original.size.value}</span>
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: (table) => {


            return (

                < div className="flex items-center gap-2 w-6 h-6" >
                    <div className={`w-6 h-6 rounded-full border border-black`} style={{ backgroundColor: table.row.original.color.value as string }} />
                </div >
            )

        }
    },
    {
        accessorKey: "created_at",
        header: "Date",
    },
    {
        id: 'actions',
        cell: (table) => {

            const readyProduct = {
                id: table.row.original.id,
                category: table.row.original.category.id,
                size: table.row.original.size.id,
                label: table.row.original.label,
                price: table.row.original.priceToModal,
                isFeatured: table.row.original.isFeatured,
                isArchived: table.row.original.isArchived,
                color: table.row.original.color.id,
            }

            const defaultVal = {
                color: table.row.original.color,
                size: table.row.original.size,
                category: table.row.original.category,
            }

            return (<Action product={readyProduct} defaultVal={defaultVal} />)
        }
    }

]
