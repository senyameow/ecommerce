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
    label: z.string().min(1, {
        message: 'billboard should have a label'
    }).max(10, { message: 'wowowowow chill out, big name!' }),
    billboardId: z.string().min(1, ' ')
})

export const CategoryModal = () => {

    const { onClose, isOpen, type, data } = useModalStore()

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const isModalOpen = type === 'createCategory' && isOpen

    const { storeId, billboardsByStoreId } = data

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/categories`,
                query: {
                    storeId
                }
            })
            const res = await axios.post(url, values)
            toast.success('billboard has been created!')
            onClose()
            // window.location.assign(`/${storeId}/categories`)




        } catch (error) {
            toast.error('something went wrong')
            console.log(error, 'CREATING STORE ERROR')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: '',
            billboardId: '',
        }
    })


    return (

        < Modal title="create a category" description="create your category for the store!" isOpen={isModalOpen} onClose={onClose}>
            <div>
                <div className="py-2 pb-4 space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="label for your billboard" {...field} className="border border-black ring-0 ring-offset-0 focus-visible:ring-offset-0 focus-visible:ring-0 outline-none " />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='billboardId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billboard</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {billboardsByStoreId?.map(item => (
                                                    <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 justify-self-end items-center justify-end place-self-end w-full flex gap-x-4">
                                <Button disabled={loading} variant={'outline'} onClick={onClose}>Cancel</Button>
                                <Button disabled={loading} type="submit" >Submit</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal >
    )
}