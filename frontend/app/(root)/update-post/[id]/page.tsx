"use client";
import PostForm from "@/components/forms/PostForm";
import { Post } from "@/types";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`);
        if (!response.status) {
            console.error("Failed to fetch post:", response.statusText);
            throw new Error("Failed to fetch post");
        }
        const data: Post = await response.data as Post;
        console.log("Fetched post:", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
    }, [id]);
  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

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
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;