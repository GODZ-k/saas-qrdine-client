import Navbar from '@/components/Home/Navbar'
import { ReactNode } from 'react'
// import NextTopLoader from 'nextjs-toploader';


function Outlet({children}:{children:ReactNode}) {
  return (
    <>
    {/* <NextTopLoader /> */}
    <Navbar/>
    {children}
    </>
  )
}

export default Outlet