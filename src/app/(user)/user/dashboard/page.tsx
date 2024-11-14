"use server"
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';
import React from 'react';


async function fetchData(token:string) {
  const res = await axios.get('http://localhost:8080/api/v1/user/profile' ,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
 return await res.data.loggedInUser 
}

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  // Fetch user data on the server side

  const data = await fetchData(token as string)


  return (
    <div>
      <h1>Welcome, {data?.First_name || "User"}!</h1>
      <p>Email: {data?.EmailAddress || "No email provided"}</p>
      {
        data?.Role === "USER" && !data.isSubscribed && (
         <>
          <div>
            You haven't subscribed yet.
          </div>
            <Button>Buy a subscription</Button>
            </>
        )
      }
      {/* Display additional user information if needed */}
    </div>
  );
}
