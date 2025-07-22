"use client";
import * as z from "zod";
import {ID} from "appwrite";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea,} from "@/components/ui";
import FileUploader from "@/components/shared/FileUploader";
import {useRouter} from "next/navigation";
import {storage} from "@/utils/appwrite";
import axios from "@/utils/axiosInstance";
import {toast} from "sonner";

interface Post {
  id: string;
  caption: string;
  media_url: string;
}

type PostFormProps = {
  post?: Post;
  action: "Create" | "Update";
};

const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 characters" }),
  file: z.custom<File>(),
});
const PostForm = ({ post, action }: PostFormProps) => {
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: undefined,
    },
  });

  const router = useRouter();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      console.log("Updating post with value:", value);
      const appwrite_file_upload = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
        ID.unique(),
        value.file
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
      const updatedPost = await axios.put(`/post/${post.id}`, {
        media_url: fileUrl,
        caption: value.caption,
      });

      if (!updatedPost) {
        toast.error(`${action} post failed. Please try again.`);
        return;
      }
      
      // return router.push("/");
    }

    // ACTION = CREATE
    console.log("Creating post with value:", value.file);
    if (!(value.file instanceof File)) {
      toast.error("Please select a file to upload.");
      return;
    }
    const appwrite_file_upload = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      ID.unique(),
      value.file
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

    const newPost = await axios.post("/post", {
      caption: value.caption,
      media_url: fileUrl,
    });

    if (!newPost) {
      toast.error(`${action} post failed. Please try again.`);
      return;
    }
    toast.success(`${action} post successfully!`);
    form.reset();
    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
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

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.media_url || ""}
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
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
