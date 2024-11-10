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
import CircularProgress from "@mui/material/CircularProgress";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Social_auth from "@/components/auth/Social_auth";
import { authRoutes, publicRoutes } from "@/Routes";
import { role } from "@/Types";

interface SignUpInput {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

interface UserVerification {
  otp: number;
}

function SignUp() {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [error, setError] = useState<string | ''>('');
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const {
    register: registerSignUp,
    formState: { errors: signUpErrors },
    handleSubmit: handleSignUpSubmit,
  } = useForm<SignUpInput>();

  const {
    register: registerVerification,
    formState: { errors: verificationErrors },
    handleSubmit: handleVerificationSubmit,
  } = useForm<UserVerification>();

  useEffect(()=>{
    setError('')
  },[pendingVerification,message])


  if (!isLoaded) {
    return (
      <div className=" flex justify-center items-center h-screen absolute top-0 w-full">
        <Loading />
      </div>
    );
  }

  const handleSignUp: SubmitHandler<SignUpInput> = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    if (!isLoaded) {
      return <Loading />;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata:{
          role:role.USER
        }
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      setMessage(true);
    } catch (error) {
      setLoading(false);
      setMessage(false);
      setPendingVerification(false);
      if (error) {
        setError(error.errors[0].message); // Set Clerk's error message
      } else {
        setError("Something went wrong. Please try again."); // Generic error fallback
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserVerification: SubmitHandler<UserVerification> = async ({
    otp,
  }: {
    otp: number;
  }) => {
    
    setLoading(true);
    if (!isLoaded) {
      return <Loading />;
    }

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: otp,
      });

      if (completeSignUp?.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp?.status === "complete") {
        await setActive({
          session: completeSignUp.createdSessionId,
        });
        router.push(publicRoutes.dashboard);
      }
    } catch (error) {
      setMessage(false);
      setLoading(false);
      if (error) {
        setError(error.errors[0].message); // Set Clerk's error message
      } else {
        setError("Something went wrong. Please try again."); // Generic error fallback
      }
    } finally {
      setMessage(false);
      setLoading(false);
    }
  };

 
  return (
    <div className=" w-full h-screen flex justify-center items-start mt-10">
      <Card className=" w-96">
        <CardHeader>
          <CardTitle className=" text-center w-full">
            Create an account
          </CardTitle>
          <CardDescription className=" text-center w-full">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingVerification ? (
            <div className=" space-y-6">
              {/* {message && (
                <Alert className=" border-none bg-green-100">
                  <AlertDescription className=" text-sm text-green-600">
                    We have sent you a verification code to your email. please
                    verify your account
                  </AlertDescription>
                </Alert>
              )} */}
              {error && (
                <Alert className=" border-none bg-red-100">
                  <AlertDescription className=" text-sm text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className=" flex justify-center items-center">
                <div className=" border-b  border-gray-200 w-full"></div>
                <div className=" mx-2 text-gray-400 text-sm">or</div>
                <div className=" border-b  border-gray-200 w-full"></div>
              </div>
              <form
                onSubmit={handleVerificationSubmit(handleUserVerification)}
                className=" space-y-4"
              >
                <div className=" space-y-1">
                  <Label htmlFor="email">OTP</Label>
                  <Input
                    type="number"
                    maxLength={6}
                    minLength={6}
                    {...registerVerification("otp", {
                      required: "otp must be required",
                      maxLength: {
                        value: 6,
                        message: "Please enter a valid otp",
                      },
                      minLength: {
                        value: 6,
                        message: "Please enter a valid otp",
                      },
                    })}
                  />
                  {verificationErrors?.otp && (
                    <p className=" text-sm !mt-1 text-red-500" role="alert">
                      {verificationErrors.otp?.message}
                    </p>
                  )}
                </div>
                <div className=" w-full">
                  <Button
                    disabled={loading}
                    type="submit"
                    className=" bg-blue-600 w-full hover:bg-blue-500"
                  >
                    {loading ? <Loading /> : "Verify"}
                  </Button>
                </div>
              </form>
              {/* <div className=" w-full text-center text-sm text-gray-500">
               Already have an account?{" "}
               <Link className=" text-blue-600 font-semibold" href={"/sign-in"}>
                 {" "}
                 Sign in
               </Link>
             </div> */}
            </div>
          ) : (
            <div className=" space-y-6">
              <Social_auth />

              {message && (
                <Alert className=" border-none bg-green-100">
                  <AlertDescription className=" text-sm text-green-600">
                    We have sent you a verification code to your email. please
                    verify your account
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
              <div className=" flex justify-center items-center">
                <div className=" border-b  border-gray-200 w-full"></div>
                <div className=" mx-2 text-gray-400 text-sm">or</div>
                <div className=" border-b  border-gray-200 w-full"></div>
              </div>
              <form
                onSubmit={handleSignUpSubmit(handleSignUp)}
                className=" space-y-4"
              >
                <div className=" flex justify-between gap-5 items-center">
                  <div className=" space-y-1 w-1/2">
                    <Label htmlFor="email">First name</Label>
                    <Input
                      type="text"
                      {...registerSignUp("firstName", {
                        required: "Name must be required",
                      })}
                    />
                  </div>
                  <div className=" space-y-1 w-1/2">
                    <Label htmlFor="email">Last name</Label>
                    <Input type="text" {...registerSignUp("lastName")} />
                  </div>
                </div>
                {signUpErrors?.firstName && (
                  <p className=" text-sm !mt-1 text-red-500" role="alert">
                    {signUpErrors.firstName?.message}
                  </p>
                )}
                <div className=" space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    type="text"
                    {...registerSignUp("email", {
                      required: "Email must be required",
                      pattern: {
                        value: /^[^@]+@[^@]+\.[^@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {signUpErrors?.email && (
                    <p className=" text-sm !mt-1 text-red-500" role="alert">
                      {signUpErrors.email?.message}
                    </p>
                  )}
                </div>
                <div className=" space-y-1">
                  <Label htmlFor="email">Password</Label>
                  <Input
                    type="password"
                    {...registerSignUp("password", {
                      required: "Password must be required",
                      minLength: {
                        value: 8,
                        message: "Password must be greater then 8 character",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                        message:
                          "Password must be at least 8 characters long, contain uppercase, lowercase, a digit, and a special character",
                      },
                    })}
                  />
                  {signUpErrors?.password && (
                    <p className=" text-sm !mt-1 text-red-500" role="alert">
                      {signUpErrors.password?.message}
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
                Already have an account?{" "}
                <Link
                  className=" text-blue-600 font-semibold"
                  href={authRoutes.signin}
                >
                  {" "}
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
