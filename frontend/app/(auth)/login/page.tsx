'use client'
import * as z from "zod";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import Image from "next/image";
import {toast} from "sonner"
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {AuthResponse} from "@/types";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import axios from '@/utils/axiosInstance';

const Login = () => {
  const router = useRouter();
    const SigninValidation = z.object({
      login: z.string().min(2, { message: "Login must be at least 2 characters." }).refine(
        (value) => /\S+@\S+\.\S+/.test(value) || value.length >= 2,
        { message: "Login must be a valid email or at least 2 characters as a username." }
      ),
      password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    });
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            login: "",
            password: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
const handleSignIn = async (user: z.infer<typeof SigninValidation>) => {

    try {
        setIsLoading(true);
        const response = await axios.post('/auth/login', {
            login: user.login,
            password: user.password,
        });
        const data: AuthResponse = response.data as AuthResponse; // Extract the response data
        console.log(data); // Handle the response data
        localStorage.setItem("accessToken", data.token);
        form.reset();
        toast("Login successful!");
        window.location.href = "/"; // Redirect to the home page
    } catch (error) {
        toast("Something went wrong. Please check your credentials.");
        console.error("Error during sign-in:", error);
    } finally {
        setIsLoading(false);
    }
};

  return (
      <div className="flex flex-col items-center justify-center h-screen w-1/2 ">
          <Form {...form}>
              <div className="sm:w-420 flex-center flex-col">
                  <Image src="/images/logo.svg" height={100} width={300} alt="logo" />

                  <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                      Log in to your account
                  </h2>
                  <p className="text-light-3 small-medium md:base-regular mt-2">
                      Welcome back! Please enter your details.
                  </p>
                  <form
                      onSubmit={form.handleSubmit(handleSignIn)}
                      className="flex flex-col gap-5 w-full mt-4">
                      <FormField
                          control={form.control}
                          name="login"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="shad-form_label">Email</FormLabel>
                                  <FormControl>
                                      <Input type="text" className="shad-input" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="shad-form_label">Password</FormLabel>
                                  <FormControl>
                                      <Input type="password" className="shad-input" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <Button type="submit" className="shad-button_primary">
                          {isLoading ? (
                              <div className="flex-center gap-2">
                                  <Loader /> Loading...
                              </div>
                          ) : (
                              "Log in"
                          )}
                      </Button>

                      <p className="text-small-regular text-light-2 text-center mt-2">
                          Don&apos;t have an account?
                          <Link
                              href="/signup"
                              className="text-primary-500 text-small-semibold ml-1">
                              Sign up
                          </Link>
                      </p>
                  </form>
              </div>
          </Form>
      </div>
  );
};

export default Login;
