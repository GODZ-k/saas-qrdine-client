import Demo from '@/components/Home/Demo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Home() {
  return (
    <>
    <Link href={"/dashboard"}>
    <Button>Dashboard</Button></Link>
    <div>Request a demo</div>
    <Demo/>
    </>
  )
}

export default Home