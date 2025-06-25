"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'


function Header() {
     const {data : session} = useSession()

     const handleSignOut = async ()=>{
        try {
            await signOut();
        } catch (error) {
             
        }
     }
  return (
    <div className='py-4 m-0 flex justify-between bg-orange-400 text-black sticky top-0 z-[999]'>

        <div>
          <Link  href="/reels" className='px-4 text-2xl'>ReelsPro</Link>
        </div>
           {session?(
            <div className='flex items-center mx-2'>
                <Link href="/upload" className='mx-5'>Upload Video</Link>
                <Link href="/upload-post" className='mx-5'>Upload Post</Link>
                <button onClick={handleSignOut} className='mx-5'>SignOut</button>
            </div>
            
           ):(
             <div className='flex items-center mx-2'>
                <Link href='/login' className='mx-5'>Login</Link>
                <Link href='/register' className='mx-5'>Register</Link>
             </div>
           )}
    </div>
  )
}

export default Header