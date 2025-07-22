'use client';
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUser } from "@/providers/AuthProvider";
import { Post } from "@/types";
import React from "react";

const Saved = () => {
  const { user, loading } = useUser() ?? { user: null, loading: true };

  const savePosts = user?.saved_posts
    .map((savePost: Post) => ({
      ...savePost,
    }))
    .reverse();
  if (loading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  if (!user){
    window.location.href = "/login";
    return null; // Prevents further rendering
  }
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!user ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts?.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts!} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
