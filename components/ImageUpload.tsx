'use client'
import React from 'react'
import { UploadDropzone } from '@/lib/uploadthing'

import '@uploadthing/react/styles.css'


// теперь надо забрать картинку с хранилища (как?)

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

interface FileUploadProps {
    endpoint: "billboardImage" | 'productImage'
    value: string;
    onChange: (url?: string) => void
}

// оооо какую классную штуку можно сделать!!

// когда мы загрузили картинку, то рендерим не дропзон а саму эту картинку!!!!



const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {

    // нам надо получить тип файла


    // const fileType = value.split('.').pop() // в валью мы прокидываем значение поля (строка юрл картинки), сплитом разбиваем по точкам, и попом достаем последний элемент массива - расширение


    if (value.length > 0) {
        return (
            <div className='h-44 w-44 relative'>
                <Image src={value} alt='server image' fill className='rounded-md' />
                <button onClick={() => onChange('')} className='absolute top-2 right-2 rounded-full p-1 shadow-lg shadow-gray-400 bg-red-500'>
                    <X className=' w-4 h-4 text-white' type='button' />
                </button> {/* с помощью такой ерунды как onChange мы можем убирать эту фотку и вставлять другую (просто пропихиваем пустую строчку, что заменяет наш линк картинки на пустую строку) */}
            </div>
        )
    }

    // if (endpoint === 'productImage' && value.length > 0) {
    //     // {
    //     //     value.map((item, ind) => (
    //     //         <div key={ind} className='h-24 w-24 relative'>
    //     //             <Image src={item} alt='server image' fill className='rounded-md' />
    //     //             <button onClick={() => onChange('')} className='absolute top-2 right-2 rounded-full p-1 shadow-lg shadow-gray-400 bg-red-500'>
    //     //                 <X className=' w-4 h-4 text-white' type='button' />
    //     //             </button> {/* с помощью такой ерунды как onChange мы можем убирать эту фотку и вставлять другую (просто пропихиваем пустую строчку, что заменяет наш линк картинки на пустую строку) */}
    //     //         </div>
    //     //     ))
    //     // }
    // }

    // if (fileType === 'pdf' && value) {
    //     return (
    //         <div className='relative bg-black/10 flex items-center'>
    //             <FileIcon />
    //             <a href={value} className='' target='_blank' rel='noopener noreferrer'></a>
    //         </div>
    //     )
    // }



    return (
        <UploadDropzone endpoint={endpoint} onUploadError={(error: Error) => { }} onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }} />

    )
}

export default FileUpload