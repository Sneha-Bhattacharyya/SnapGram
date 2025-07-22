"use client";
import { multiFormatDateString } from "@/lib/utils";
import { useUser } from "@/providers/AuthProvider";
import { Post } from "@/types";
import Link from "next/link";
import React from "react";

import PostStats from "./PostStats";
import { Input } from "../ui";
import axios from "@/utils/axiosInstance";
import CommentInputBox from "./CommentInputBox";

const PostCard = ({ post }: { post: Post }) => {
  const { user, loading } = useUser() ?? { user: null, loading: true };




  if (!post.ownerId) return;

  
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.ownerId}`}>
            <img
              src={post.owner?.dp_url || "/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.owner.name}
            </p>
            <div className="flex gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.timestamp)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/update-post/${post.id}`}
          className={`${user?.id !== post.owner.id && "hidden"}`}
        >
          <img src={"/icons/edit.svg"} alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link href={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
        </div>

        <img
          src={post.media_url || "/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user?.id ?? ""} />

      <Link href={`/posts/${post.id}`} className="flex items-center gap-2 mt-5">
        <span className="text-light-3">View all {post.comments.length} comments</span>
      </Link>

      <CommentInputBox postId={post.id} />
    </div>
  );
};

export default PostCard;
