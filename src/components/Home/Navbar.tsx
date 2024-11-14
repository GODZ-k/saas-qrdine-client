"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import Link from "next/link";
// import Loading from "@/app/loading";
import { Skeleton } from "@mui/material";
// import { UserProfile } from "@clerk/nextjs";
import { authRoutes, publicRoutes } from "../../Routes";
import { role } from "@/Types";

function Navbar() {
  // const { signOut, session } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();


  useEffect(() => {
    (async()=>{
      if (!user?.unsafeMetadata || Object.keys(user?.unsafeMetadata).length === 0) {
        await user?.update({
         unsafeMetadata:{
           role:role.USER
         }
        })
     }
     const token  = await getToken(user)
     console.log(token)
    })()
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="flex justify-between items-center p-3 gap-2 rounded-md">
        <Skeleton
          variant="rectangular"
          width={250}
          sx={{ bgcolor: "grey.300", padding: "6px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ bgcolor: "grey.300", padding: "6px" }}
          height={60}
        />
        <div className=" flex gap-2 items-center">
          <Skeleton
            variant="rectangular"
            width={100}
            sx={{ bgcolor: "grey.300", padding: "6px" }}
            height={60}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            sx={{ bgcolor: "grey.300", padding: "6px" }}
            height={60}
          />
        </div>
      </div>
    );
  }

  // // console.log(user);

  // (async () => {
  //   await getToken();
  // })();
  // async function handleSignOut() {
  //   await signOut({ redirectUrl: "/auth/sign-in", sessionId: session?.id });
  // }
  return (
    <div className="">
      {isSignedIn ? (
        <div className="flex justify-between items-center p-3">
          <div className=" font-semibold text-2xl text-yellow-600">
            <Link href={publicRoutes.home}>QRDine-In</Link>
          </div>
          <div className=" flex gap-2 items-center ">
            <span className=" font-semibold">Welcome,</span>
            <UserButton />
            {/* <Button onClick={handleSignOut} className="bg-red-600  hover:bg-red-500">
          <Link href="/auth/sign-in">Logout</Link>
        </Button> */}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center p-3">
          <div className=" font-semibold text-2xl text-yellow-600">
            <Link href={publicRoutes.home}>QRDine-In</Link>
          </div>
          <div className=" flex gap-2 items-center">
            <Button className=" bg-blue-600  hover:bg-blue-500">
              <Link href={authRoutes.signin}>Sign in</Link>
            </Button>
            <Button className=" border border-black hover:bg-gray-50 bg-white text-black shadow-none">
              <Link href={authRoutes.signup}>Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
