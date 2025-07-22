"use client";
import { useUser } from "@/providers/AuthProvider";
import { Post } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "@/utils/axiosInstance";
type PostStatsProps = {
  post: Post;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  console.log("PostStats Component Rendered", post, userId);

  const likesList = post.liked_by.map((user) => user.id);
  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(likes.includes(userId));
  const { user, loading } = useUser() ?? { user: null, loading: true };
  const savedPostRecord = post.saved_by.find((user) => user.id === userId);
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [user]);

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
      setLikes(likesArray);
      setIsLiked(false);
      const response = await axios.post("/user/unlike/post", {
        id: post.id,
        userId: userId,
      });
      if (response.status !== 200) {
        toast.error("Error unliking post");
      }
      return;
    } else {
      likesArray.push(userId);
      setIsLiked(true);
    }

    setLikes(likesArray);

    const response = await axios.post("/user/like/post", {
      id: post.id,
      userId: userId,
    });
    if (response.status !== 200) {
      toast.error("Error liking post");
      return;
    }
  };

  const handleSavePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      const response = await axios.post("/user/unsave/post", {
        id: post.id,
        userId: userId,
      });
      if (response.status !== 200) {
        toast.error("Error unsaving post");
        return;
      }
    } else {
      setIsSaved(true);
    }
    const response = await axios.post("/user/save/post", {
      id: post.id,
      userId: userId,
    });

    if (response.status !== 200) {
      toast.error("Error saving post");
      return;
    }
  };
  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex gap-2 mr-2">
          <img
            src={isLiked ? "/icons/liked.svg" : "/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2 mr-2">
          <img
            src="/icons/comment.svg"
            alt="comment"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </div>
        <div className="flex gap-2 mr-2">
          <img
            src="/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => {
              const { origin, pathname } = window.location;
              let urlToCopy = "";
              if (pathname.includes("/posts")) {
                urlToCopy = origin + pathname;
              } else {
                urlToCopy = `${origin}/posts/${post.id}`;
              }
              navigator.clipboard.writeText(urlToCopy);
              toast.success("Link copied to clipboard!");
            }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/icons/saved.svg" : "/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
