'use client'
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {toast} from "sonner";
import {Button, Input, Textarea} from "@/components/ui";
import ProfileUploader from "@/components/shared/ProfileUploader";
import Loader from "@/components/shared/Loader";
import {useUser} from "@/providers/AuthProvider";
import {useState} from "react";
import {UserPreview} from "@/types";
import {useParams} from "next/navigation";
import axios from "@/utils/axiosInstance";
import {router} from "next/client";
import {storage} from "@/utils/appwrite";
import {ID} from "appwrite";
// file: z.array(z.custom<File>()),
const ProfileValidation = z.object({
    file: z.array(z.custom<File>()),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
const UpdateProfile = () => {
  const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const {user, loading: userLoading} = useUser() ?? {user: null, loading: true};
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: undefined,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      bio: user?.bio || "",
    },
  });


    const [currentUser, setCurrentUser] = useState<UserPreview | undefined>(user!);
    if (!currentUser || userLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
      try {
          setLoading(true);
          console.log("Updating profile with value:", value);
          const appwrite_file_upload = await storage.createFile(
              process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
              ID.unique(),
              value.file[0] as File
          );
          let fileUrl = "";
          try {
              fileUrl = storage.getFilePreview(
                  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
                  appwrite_file_upload.$id,
                  2000,
                  2000,
                  "top" as any,
                  100
              );

              if (!fileUrl) throw Error;
          } catch (error) {
              console.log(error);
          }
          if (!fileUrl) {
              toast.error("File upload failed. Please try again.");
              return;
          }
          console.log("File URL:", fileUrl);
          const updatedUser = await axios.put('/user', {
              id: id,
              data: {
                  name: value.name,
                  username: value.username,
                  email: value.email,
                  bio: value.bio,
                  dp_url: fileUrl
              },
          });

          if (updatedUser.status !== 200) {
              toast.error("Failed to update profile. Please try again.");
              return;
          }
          const data: UserPreview = await updatedUser.data as UserPreview;
          setCurrentUser(data);
          window.location.replace(`/profile/${id}`);
      } catch (error) {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
              src="/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.dp_url || ""}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
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
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
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
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={loading}>
                  {loading && <Loader/>}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;