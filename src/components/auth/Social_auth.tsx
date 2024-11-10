"use client";
import React, { useState } from "react";
import { OAuthStrategy } from '@clerk/types'
import { Button } from "../ui/button";
import Loading from "@/app/loading";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { authRoutes, publicRoutes } from "../../Routes";
// import { role } from "@/Types";

function Social_auth() {
  const {  signIn   } = useSignIn();
  const {  signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);

  if (!signIn || !signUp) return null


  const handleSignInWith = async (strategy:OAuthStrategy)=> {
    setLoading(true);
    try {
        return await signIn.authenticateWithRedirect({
            strategy,
            redirectUrl: authRoutes.redirectUrl,
            redirectUrlComplete: publicRoutes.dashboard,
          })

    } catch (error) {
      console.log(error?.errors[0].message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
 
  async function handleSocialAuth(strategy:OAuthStrategy){
    if (!signIn || !signUp) return null

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code === 'external_account_exists'

      if (userExistsButNeedsToSignIn) {
        const res = await signIn.create({ transfer: true })
  
        console.log('sociala_auth' , res)
        if (res.status === 'complete') {
          setActive({
            session: res.createdSessionId,
          })
        }
      }

      // If the user has an OAuth account but does not yet
    // have an account in your app, you can create an account
    // for them using the OAuth information.
    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable'

    if (userNeedsToBeCreated) {
        const res = await signUp.create({
          transfer: true,
        })

        if (res.status === 'complete') {
          setActive({
            session: res.createdSessionId,
            // role:role.USER
          })
        }
      } else {
        // If the user has an account in your application
        // and has an OAuth account connected to it, you can sign them in.
        handleSignInWith(strategy)
      }
    }
  

  return (
    <div className=" w-full flex justify-evenly gap-6 items-center">
     <Button
        onClick={() => handleSocialAuth('oauth_microsoft')}
        disabled={loading}
        className=" bg-white text-gray-800 w-32  hover:bg-gray-50 py-1"
      >
        {!loading && (
          <img src="https://img.clerk.com/static/microsoft.svg" alt="Google" />
        )} Microsoft
        {loading && <Loading />}
      </Button>
      {/* <Button
        onClick={() => handleSocialAuth('oauth_apple')}
        disabled={loading}
        className=" bg-white text-gray-800 w-32  hover:bg-gray-50 py-1"
      >
        {!loading && (
          <img src="https://img.clerk.com/static/apple.svg" alt="Google" />
        )}
        {loading && <Loading />}
      </Button> */}
      <Button
        onClick={() => handleSocialAuth('oauth_google')}
        disabled={loading}
        className=" bg-white text-gray-800 w-32  hover:bg-gray-50 py-1"
      >
        {!loading && (
          <img src="https://img.clerk.com/static/google.svg" alt="Google" />
        )} Google
        {loading && <Loading />}
      </Button>
    </div>
  );
}

export default Social_auth;
