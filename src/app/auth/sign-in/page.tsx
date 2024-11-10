"use client";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import Social_auth from "@/components/auth/Social_auth";
import { authRoutes, publicRoutes } from "@/Routes";

interface SignInUser {
  email: string;
  password: string;
}
function SignIn() {
  const router = useRouter();
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInUser>();

  useEffect(()=>{
    setError(false)
  },[message])


  const handleSignIn: SubmitHandler<SignInUser> = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    if (!isLoaded) return <Loading />;

    try {
      const loggedInUser = await signIn.create({
        identifier: email,
        password,
      });

      if (loggedInUser.status === "complete") {
        await setActive({
          session: loggedInUser.createdSessionId,
        });
        router.push(publicRoutes.dashboard);
      }
    } catch (error) {
      setError(error?.errors[0].message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  if (!isLoaded) {
    return (
      <div className=" flex justify-center items-center h-screen absolute top-0 w-full">
        <Loading />
      </div>
    );
  }


  return (
    <div className="  w-full h-screen flex justify-center items-start mt-10">
      <Card className=" w-96">
        <CardHeader>
          <CardTitle className=" text-center w-full">Welcome back</CardTitle>
          <CardDescription className=" text-center w-full">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className=" space-y-6">
         <Social_auth />
          <div className=" flex justify-center items-center">
            <div className=" border-b  border-gray-200 w-full"></div>
            <div className=" mx-2 text-gray-400 text-sm">or</div>
            <div className=" border-b  border-gray-200 w-full"></div>
          </div>
          {message && (
            <Alert className=" border-none bg-green-100">
              <AlertDescription className=" text-sm text-green-600">
                {message}
              </AlertDescription>
            </Alert>
          )}
           {error && (
            <Alert className=" border-none bg-red-100">
              <AlertDescription className=" text-sm text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(handleSignIn)} className=" space-y-4">
            <div className=" space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="text"
                {...register("email", {
                  required: "Email must be required",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors?.email && (
                <p className=" text-sm !mt-1 text-red-500" role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className=" space-y-1">
              <Label htmlFor="email">Password</Label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password must be required",
                })}
              />
              {errors?.password && (
                <p className=" text-sm !mt-1 text-red-500" role="alert">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className=" w-full">
              <Button
                disabled={loading}
                type="submit"
                className=" bg-blue-600 hover:bg-blue-500 w-full"
              >
                {loading ? <Loading /> : "Submit"}
              </Button>
            </div>
          </form>
          <div className=" w-full text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              className=" text-blue-600 font-semibold"
              href={authRoutes.signup}
            >
              {" "}
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
