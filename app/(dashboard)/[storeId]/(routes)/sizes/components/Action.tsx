'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import React, { useState } from "react"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useModalStore } from "@/hooks/use-modal-store"
import { useParams } from "next/navigation"
import axios from "axios"
import { useRouter } from "next/navigation"
import { SizesColumn } from "./columns"

interface ActionProps {
    size: SizesColumn
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success(`copied`)
}

export const Action = ({ size }: ActionProps) => {

    const router = useRouter()

    const params = useParams()

    const [isLoading, setIsLoading] = useState(false)

    const { onOpen, onClose } = useModalStore()

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/sizes/${size.id}/delete`)
            toast.success(`size ${size.label} successfully deleted`)
            router.refresh()


        } catch (error) {
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={isLoading}>
                <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isLoading} onClick={() => onCopy(size.id)}>
                    <div className="flex flex-row items-center">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy id
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isLoading} onClick={() => onOpen('updateSize', { size, storeId: params?.storeId as string })}>
                    <div className="flex flex-row items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isLoading} onClick={onDelete}>
                    <div className="flex flex-row items-center">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}