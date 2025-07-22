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
import {Loader} from "lucide-react";
import Link from "next/link";
import axios from '@/utils/axiosInstance';

const SignupValidation = z.object({
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const Signup = () => {
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    // Prevent the default form submission behavior

    try {
        setIsLoading(true);
      const response = await axios.post("/auth/register", {
      username: user.username,
      email: user.email,
      password: user.password,
      });

      const data:AuthResponse = response.data as AuthResponse; // Extract the response data
      console.log(data); // Handle the response data
      localStorage.setItem("accessToken", data.token);
      form.reset();
        router.push("/onboarding");
    } catch (error) {
      toast("Something went wrong. Please login your new account");
      console.error("Error during sign-in:", error);
    }
    finally {
        setIsLoading(false);
    }
  };
  return (
      <div className="flex flex-col items-center justify-center h-screen w-1/2 ">
          <Form {...form}>
              <div className="sm:w-420 flex-center flex-col">
                  <Image src="/images/logo.svg" height={100} width={500} alt="logo" />

                  <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                      Create a new account
                  </h2>
                  <p className="text-light-3 small-medium md:base-regular mt-2">
                      To use snapgram, Please enter your details
                  </p>

                  <form
                      onSubmit={form.handleSubmit(handleSignup)}
                      className="flex flex-col gap-5 w-full mt-4">
                      <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="shad-form_label">Username</FormLabel>
                                  <FormControl>
                                      <Input type="text" className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="email"
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
                              "Sign Up"
                          )}
                      </Button>

                      <p className="text-small-regular text-light-2 text-center mt-2">
                          Already have an account?
                          <Link
                              href="/login"
                              className="text-primary-500 text-small-semibold ml-1">
                              Log in
                          </Link>
                      </p>
                  </form>
              </div>
          </Form>
      </div>

  );
};

export default Signup;
