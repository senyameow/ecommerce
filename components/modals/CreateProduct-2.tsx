'use client'

import { useModalStore } from "@/hooks/use-modal-store"
import { Modal } from "../ui/modal"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import toast from "react-hot-toast"
import { redirect, useRouter } from "next/navigation"
import qs from 'query-string'
import FileUpload from "../ImageUpload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const formSchema = z.object({

    image_url: z.string().min(1, ' '),

})

export const ProductModalTwo = () => {

    const { onClose, isOpen, type, data, onOpen } = useModalStore()

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const isModalOpen = type === 'createProduct-2' && isOpen

    const { storeId, values: firstValues, colors, sizes, categories, defaultVal } = data

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            const allValues = { ...firstValues, ...values }
            setLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/products`,
                query: {
                    storeId
                }
            })
            const res = await axios.post(url, allValues)
            toast.success('product has been created!')
            onClose()
            window.location.assign(`/${storeId}/products`)




        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setLoading(false)
            onClose()
            router.refresh()
        }
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image_url: '',
        }
    })

    const onPrev = () => {
        onOpen('createProduct-1', { values: firstValues, categories, colors, sizes, defaultVal })
    }


    return (

        < Modal title="create a product" description="create a beautiful looking product" isOpen={isModalOpen} onClose={onClose}>
            <div>
                <div className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <div className="flex justify-center items-center w-full">
                                <FormField
                                    control={form.control}
                                    name='image_url'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint='productImage'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className=" justify-self-end items-center justify-end place-self-end w-full flex gap-x-4">
                                <Button disabled={loading} variant={'outline'} onClick={onPrev}>Cancel</Button>
                                <Button disabled={loading} type="submit" >Submit</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal >
    )
}