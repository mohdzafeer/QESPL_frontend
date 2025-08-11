import React from 'react'
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { SiTicktick } from "react-icons/si";

const UserTaskCards = () => {
  return (
    <div className='grid xl:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-4'>
        <div className='flex items-center justify-start gap-3 bg-white dark:bg-zinc-900 rounded-lg lg:py-4 lg:px-4 xl:py-4 xl:px-4 p-2 border'>
            <div className='bg-blue-100 text-blue-500 p-1 lg:text-4xl xl:text-4xl text-xl rounded-lg'>
                <IoDocumentTextOutline/>
            </div>
            <div className='flex flex-col items-start'>
                <span className=' lg:text-lg xl:text-lg text-xs text-start'>Total Tasks</span>
                <span className='lg:text-xl xl:text-xl text-sm font-bold'>5</span>
            </div>
        </div>
        <div className='flex items-center justify-start gap-3 bg-white dark:bg-zinc-900 rounded-lg lg:py-4 lg:px-4 xl:py-4 xl:px-4 p-2 border'>
            <div className='bg-yellow-100 text-yellow-500 p-1 lg:text-4xl xl:text-4xl text-lg rounded-lg'>
                <MdAccessTime/>
            </div>
            <div className='flex flex-col items-start'>
                <span className=' lg:text-lg xl:text-lg text-xs text-start'>Pending Tasks</span>
                <span className='lg:text-xl xl:text-xl text-sm font-bold'>5</span>
            </div>
        </div>
        <div className='flex items-center justify-start gap-3 bg-white dark:bg-zinc-900 rounded-lg lg:py-4 lg:px-4 xl:py-4 xl:px-4 p-2 border'>
            <div className='bg-green-100 text-green-500 p-1 lg:text-4xl xl:text-4xl text-xl rounded-lg'>
                <SiTicktick/>
            </div>
            <div className='flex flex-col items-start'>
                <span className=' lg:text-lg xl:text-lg text-xs text-start'>Completed Tasks</span>
                <span className='lg:text-xl xl:text-xl text-sm font-bold'>5</span>
            </div>
        </div>
    </div>
  )
}

export default UserTaskCards