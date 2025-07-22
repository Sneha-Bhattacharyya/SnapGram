"use client";

import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui";
import { multiFormatDateString } from "@/lib/utils";
import { useUser } from "@/providers/AuthProvider";
import { Post } from "@/types";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import GridPostList from "@/components/shared/GridPostList";
import PostComments from "@/components/shared/PostComments";
import CommentInputBox from "@/components/shared/CommentInputBox";

const PostDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useUser() ?? { user: null, loading: true };
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isUserPostLoading, setIsUserPostLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`);
        if (!response.status) {
          console.error("Failed to fetch post:", response.statusText);
          throw new Error("Failed to fetch post");
        }
        const data: Post = await response.data as Post;
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsPostLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/user/${user?.id}/posts`);
        if (!response.status) {
          console.error("Failed to fetch user posts:", response.statusText);
          throw new Error("Failed to fetch user posts");
        }
        setUserPosts(response.data as Post[]);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setIsUserPostLoading(false);
      }
    };

    fetchPost();
    if (user?.id) fetchUserPosts();
  }
  , [id, user?.id]);

  const relatedPosts = userPosts?.filter(
    (userPost) => userPost.id !== id
  );

  const handleDeletePost = async () => {
    const response = await axios.delete(`/post/${id}`);
    if (!response.status) {
      console.error("Failed to delete post:", response.statusText);
      return;
    }
    router.back();
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPostLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.media_url}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                href={`/profile/${post.ownerId}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post.owner.dp_url ||
                    "/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.owner.name}
                  </p>
                  <div className="flex gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post.timestamp)}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  href={`/update-post/${post.id}`}
                  className={`${user?.id !== post?.ownerId && "hidden"}`}
                >
                  <img
                    src={"/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user?.id !== post?.ownerId && "hidden"
                  }`}
                >
                  <img
                    src={"/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
            </div>
            <PostComments postId={post.id} />
            <div className="w-full">
              <PostStats post={post} userId={user?.id || ""} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
