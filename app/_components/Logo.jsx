import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link href={'/dashboard'} className='flex items-center gap-2'>
        <Image src="/images/atc_logo.png" alt='logo'
        width={70} height={70} />
        <h2 className='font-bold text-xl'>ATC</h2>
    </Link>
  )
}

export default Logo