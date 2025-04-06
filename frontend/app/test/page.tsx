import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div>
        <Image src='/snap_logo.png' width={500} height={500} alt='logo'/>
    </div>
  )
}

export default page