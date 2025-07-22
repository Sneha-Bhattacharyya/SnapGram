import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { toast } from "sonner";
import { useUser } from "@/providers/AuthProvider";
import axios from "@/utils/axiosInstance";

const CommentInputBox = ({
  postId,
  parentCommentId,
  fetchFunction,
}: {
  postId: string;
  parentCommentId?: string;
  fetchFunction?: () => void; // Optional function to call after comment submission
}) => {
  const { user, loading } = useUser() ?? { user: null, loading: true };
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const handleEmojiSelect = (emoji: any) => {
    setComment((prev) => prev + emoji.native);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleComment = async () => {
    console.log("Comment submitted:", comment);

    if (!comment.trim()) {
      toast.warning("Comment is empty");
      return;
    }

    try {
      if (parentCommentId) {
        const response = await axios.post("/comment", {
          body: comment,
          postId,
          authorId: user?.id,
          parentCommentId,
        });
        if (response.status === 201) {
          toast.success("Reply added successfully");
          setComment("");
          setShowPicker(false);
          if (fetchFunction) {
            fetchFunction(); // Call the provided function to re-fetch comments
          }
          // Optionally, you can trigger a re-fetch of comments here
        } else {
          toast.error("Failed to add reply");
        }
        return;
      }
      const response = await axios.post("/comment", {
        body: comment,
        postId,
        authorId: user?.id,
      });

      if (response.status === 201) {
        toast.success("Comment added successfully");
        setComment("");
        setShowPicker(false);
        if (fetchFunction) {
            fetchFunction(); // Call the provided function to re-fetch comments
          }
        // Optionally, you can trigger a re-fetch of comments here
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    }
    setComment("");
    setShowPicker(false);
  };

  return (
    <div className="relative mt-5 flex items-center">
      <Input
        placeholder="Add a comment..."
        className="shad-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleComment();
          }
        }}
      />
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="text-light-3"
      >
        <img
          src="/icons/emoji.svg"
          alt="emoji"
          width={47}
          height={47}
          className="rounded-xl"
        />
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-full right-0 mb-2 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </div>
  );
};

export default CommentInputBox;
