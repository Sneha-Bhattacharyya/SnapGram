"use client";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUser } from "@/providers/AuthProvider";


const LikedPosts = () => {
    const { user, loading } = useUser() ?? { user: null, loading: true };
    console.log("LikedPosts: ", user?.liked_posts);
  if (!user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {user.liked_posts.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={user.liked_posts} showStats={false} />
    </>
  );
};

export default LikedPosts;