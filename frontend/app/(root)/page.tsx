'use client'
import {useUser} from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import {toast} from "sonner";
import Loader from "@/components/shared/Loader";
import { Post, UserPreview } from "@/types";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [creators, setCreators] = useState<UserPreview[]>([]);
  const { user, loading } = useUser() ?? { user: null, loading: true };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<{ posts: Post[] }>("/post?all=true");
        setPosts(response.data?.posts as Post[]);
        console.log("Posts fetched:", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    const fetchCreators = async () => {
      try {
        const response = await axios.get("/user");
        // Assuming the response contains a list of creators
        setCreators((response.data as any[]).slice(0, 10));
        console.log("Creators fetched:", response.data);
      } catch (error) {
        console.error("Error fetching creators:", error);
        toast.error("Failed to fetch creators");
      }
    };
    fetchCreators();
    fetchPosts();
  }, []); 
  // console.log(user);
  // const router = useRouter();
  if (loading) return <p>Loading user...</p>;
  if (!user)
    window.location.href = "/login";
  // console.log("User:", user);


  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          { !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.map((post: Post) => (
                <li key={post.id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {!creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators.map((creator) => (
              <li key={creator?.id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
