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
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { redirect, useParams, useRouter } from "next/navigation"
import qs from 'query-string'
import FileUpload from "../ImageUpload"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

import { Checkbox } from "@/components/ui/checkbox"


const formSchema = z.object({
    label: z.string().min(1, {
        message: 'billboard should have a label'
    }).max(10, { message: 'wowowowow chill out, big name!' }),
    isArchived: z.boolean(),
    isFeatured: z.boolean(),
    price: z.string().min(1, ' '),
    category: z.string().min(1, ' '),
    color: z.string().min(1, ' '),
    size: z.string().min(1, ' ')
})

export const UpdateProduct = () => {


    const { onClose, isOpen, type, data, onOpen, Colors, Sizes, Categories } = useModalStore()

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const isModalOpen = type === 'updateProduct' && isOpen

    const { values, storeId, defaultVal, productId } = data



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: values?.label || '',
            isArchived: values?.isArchived || undefined,
            isFeatured: values?.isFeatured || undefined,
            price: values?.price || '',
            category: values?.category || '',
            color: values?.color || '',
            size: values?.size || ''
        }
    })

    useEffect(() => {
        if (values) {
            form.setValue('label', values?.label);
            form.setValue('isArchived', values?.isArchived);
            form.setValue('isFeatured', values?.isFeatured);
            form.setValue('price', values?.price);
            form.setValue('category', defaultVal?.category.id!);
            form.setValue('color', defaultVal?.color.id!);
            form.setValue('size', defaultVal?.size.id!);
        } // вот так можно реализовывать едитинг формы (т.е. открывается модалка, и когда она загрузилась там уже в полях есть предыдущие значения)
    }, [form, values])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/products/${productId}/change`,
                query: {
                    storeId
                }
            })
            const res = await axios.patch(url, values)
            toast.success('product has been changed!')
            onClose()
            router.refresh()




        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setLoading(false)
            onClose()
            router.refresh()
        }
    }


    return (

        < Modal title="update your product info" description="adjust price or name or whatever..." isOpen={isModalOpen} onClose={() => onClose()}>
            <div>
                <div className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField

                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="name for your product" {...field} className="border border-black ring-0 ring-offset-0 focus-visible:ring-offset-0 focus-visible:ring-0 outline-none " />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField

                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="price for your product" {...field} className="border border-black ring-0 ring-offset-0 focus-visible:ring-offset-0 focus-visible:ring-0 outline-none " />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="label for your billboard" {...field} className="border border-black ring-0 ring-offset-0 focus-visible:ring-offset-0 focus-visible:ring-0 outline-none " />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Color</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={defaultVal?.color.label} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Colors?.map(color => (
                                                    <SelectItem key={color.id} value={color.id}>{color.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Size</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={defaultVal?.size.label} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Sizes?.map(size => (
                                                    <SelectItem key={size.id} value={size.id}>{size.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Category</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={defaultVal?.category.label} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Categories?.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-around w-full">
                                <FormField
                                    control={form.control}
                                    name="isArchived"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel>Archived</FormLabel>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <FormDescription>This product will not appear anywhere in the store</FormDescription>
                                            </div>


                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel>Featured</FormLabel>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <FormDescription>This product will not appear on the home page</FormDescription>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className=" justify-self-end items-center justify-end place-self-end w-full flex gap-x-4">
                                <Button disabled={loading} variant={'outline'} onClick={onClose}>Cancel</Button>
                                <Button disabled={loading} type="submit" >Save</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal >
    )
}