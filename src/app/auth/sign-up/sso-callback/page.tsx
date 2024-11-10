import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {

  // prebuilt AuthenticateWithRedirectCallback component.
  // This is the final step in the custom OAuth flow.
  return (
    <>
     <AuthenticateWithRedirectCallback />
     </>
  )
}