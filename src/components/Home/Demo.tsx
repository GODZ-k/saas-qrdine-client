"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import axios from "axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "@/app/loading";
import { Alert, AlertDescription } from "../ui/alert";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

interface demoType {
  email: string;
  phone: string;
  message: string;
  firstName: string;
  lastName?: string;
  preferedTime?: string;
}
function Demo() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<demoType>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmitDemo: SubmitHandler<demoType> = async(data) => {
    try {
      setLoading(true)
      await axios.post("http://localhost:8080/api/v1/request-demo",data)
      .then((res)=>{
        console.log(res.data)
        setMessage(res.data?.msg)
        reset(); 
      })
    } catch (error: any) {
      setMessage(error.response.data.msg)
    } finally {
      setLoading(false)
    }
  };
  return (
    <>
      <div className="  w-full h-screen flex justify-center items-start mt-10">
        <Card className=" w-96">
          <CardHeader>
            <CardTitle className=" text-center w-full">Request a demo</CardTitle>
            <CardDescription className=" text-center w-full">
              Feel free to reach out.
            </CardDescription>
          </CardHeader>
          <CardContent className=" space-y-6">
            {message && (
              <Alert className=" border-none bg-green-100">
                <AlertDescription className=" text-sm text-green-600">
                  {message}
                </AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={handleSubmit(handleSubmitDemo)}
              className=" space-y-4"
            >
              <div className=" flex justify-between gap-5 items-center">
                <div className=" space-y-1 w-1/2">
                  <Label htmlFor="email">First name</Label>
                  <Input
                    type="text"
                    {...register("firstName", {
                      required: "Name must be required",
                    })}
                  />
                </div>
                <div className=" space-y-1 w-1/2">
                  <Label htmlFor="email">Last name</Label>
                  <Input type="text" {...register("lastName")} />
                </div>
              </div>
              {errors?.firstName && (
                <p className=" text-sm !mt-1 text-red-500" role="alert">
                  {errors?.firstName?.message}
                </p>
              )}
              <div className=" space-y-1">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="email">Phone</Label>
                <Input
                  type="number"
                  {...register("phone", {
                    required: "Phone no must be required",
                    maxLength: 10,
                    minLength: 10,
                  })}
                />
                {errors?.phone && (
                  <p className=" text-sm !mt-1 text-red-500" role="alert">
                    {errors.phone?.message}
                  </p>
                )}
              </div>
              <div className=" space-y-1">
                <Label htmlFor="email">Message</Label>
                <Input
                  type="text"
                  {...register("message", {
                    required: "Message must be required",
                    maxLength: 300,
                  })}
                />
                {errors?.message && (
                  <p className=" text-sm !mt-1 text-red-500" role="alert">
                    {errors.message?.message}
                  </p>
                )}
              </div>
              <div className=" space-y-1">
                <Label htmlFor="email">Pick a date & time</Label>
                <DemoItem>
                  <Controller
                    name="preferedTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null} // Ensure the value is a Dayjs object or null
                        onChange={(value)=> {
                          field.onChange( value ? value.toISOString() : null);
                        }}
                      />
                    )}
                  />
                </DemoItem>
                {errors?.preferedTime && (
                  <p className=" text-sm !mt-1 text-red-500" role="alert">
                    {errors.preferedTime?.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <Button
                  disabled={loading}
                  type="submit"
                  className=" bg-blue-600 hover:bg-blue-500 w-full"
                >
                  {loading ? <Loading /> : "Request a demo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Demo;
