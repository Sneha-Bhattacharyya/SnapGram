'use client'
import * as z from "zod";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Image from "next/image";
import {toast} from "sonner"
import {zodResolver} from "@hookform/resolvers/zod";
import axios from '@/utils/axiosInstance';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import {useUser} from "@/providers/AuthProvider";
import {Textarea} from "@/components/ui/textarea";

const onboardingValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
    dp_url: z.string().url().optional(),
    phone_number: z.string()
        .refine((value) => {
            if (!value) return true; // Allow empty value
            return /^\+?[1-9]\d{1,14}$/.test(value);
        }, { message: "Invalid phone number format." }).optional(),
    gender: z.enum(["male", "female", "prefer not to say"]),
})

const Onboarding = () => {
  const router = useRouter();
  const userContext = useUser(); // always called
  const user = userContext?.user ?? null;
  const loading = userContext?.loading ?? true;
  const form = useForm<z.infer<typeof onboardingValidation>>({
    resolver: zodResolver(onboardingValidation),
    defaultValues: {
        name: "",
        bio: "",
        dp_url: `https://avatar.vercel.sh/default`,
        phone_number: "",
        gender: "prefer not to say",
    },
  });
  useEffect(() => {
    console.log("User in useEffect:", user); // 👀
  
    if (user) {
        console.log("User found:", user);
        form.setValue("name", user.name || "");
        form.setValue("bio", user.bio || "");
        form.setValue("dp_url", user.dp_url || `https://avatar.vercel.sh/${user.username}`);
        form.setValue("phone_number", user.phone_number || "");
        if (typeof user.gender === "string") {
            form.setValue("gender", (["male", "female", "prefer not to say"]
                .includes(user.gender) ? user.gender : "prefer not to say") as "male" | "female" | "prefer not to say");
        }
    }
  }, [form, user]);
  
  if (loading) return <p>Loading user...</p>;
  if (!user) {
    console.log("User not found");
    return null;
  }
  const handleOnboard = async (formData: z.infer<typeof onboardingValidation>) => {
    const { id } = user;
    console.log(id);
    const data = {
      name: formData.name,
      bio: formData.bio,
      gender: formData.gender,
      phone_number: formData.phone_number,
      dp_url: formData.dp_url,
    };
    console.log(data);
    try {
        const res = await axios.put("/user", {
          id,
          data,
        });
        if (res.status === 200) {
          toast("Onboarding successful");
          router.push("/");
        } else {
          toast("Onboarding failed");
          form.reset();
        }
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast("Onboarding failed");
      form.reset();
    }
  };

  return (
      <div className="flex flex-col items-center justify-center h-screen w-1/2 ">
        <Form {...form}>
          <div className="sm:w-420 flex-center flex-col">
            <Image src="/images/logo.svg" height={100} width={300} alt="logo" />

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
              Complete your profile
            </h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
              Please complete your profile to get started.
            </p>
            <form
                onSubmit={form.handleSubmit(handleOnboard)}
                className="flex flex-col gap-5 w-full mt-4">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="shad-form_label">Name</FormLabel>
                        <FormControl>
                          <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="shad-form_label">Bio</FormLabel>
                        <FormControl>
                          <Textarea className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Phone Number</FormLabel>
                            <FormControl>
                                <Input type={'text'} className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Gender</FormLabel>
                            <FormControl>
                                <Input type={'text'} className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

              <Button type="submit" className="shad-button_primary">
                {loading ? (
                    <div className="flex-center gap-2">
                      <Loader /> Loading...
                    </div>
                ) : (
                    "Complete Profile"
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

export default Onboarding;
