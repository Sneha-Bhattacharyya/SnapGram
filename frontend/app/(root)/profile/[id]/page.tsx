'use client'
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui";
import { useUser } from "@/providers/AuthProvider";
import { UserPreview } from "@/types";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import LikedPosts from "@/components/shared/LikedPost";
interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user, loading } = useUser() ?? { user: null, loading: true };
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<UserPreview | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user/${id}`);
        if (!response.status) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.data as UserPreview;
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }
  , [id]);
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  console.log("Current User's Posts:", currentUser.posts);
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.dp_url || "/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user?.id !== currentUser.id && "hidden"}`}>
              <Link
                href={`/update-profile/${currentUser.id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user?.id !== currentUser.id && "hidden"
                }`}>
                <img
                  src={"/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user?.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.id === user?.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            href={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <button
            type="button"
            onClick={() => window.history.replaceState(null, '', `/profile/${id}/liked-posts`)}
            className={`profile-tab rounded-r-lg cursor-pointer ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </button>
        </div>
      )}

      {pathname === `/profile/${id}` && (
        <GridPostList posts={currentUser.posts} showUser={false} />
      )}
      {pathname === `/profile/${id}/liked-posts` && currentUser.id === user?.id && (
        // You need to implement or import LikedPosts component
        <div>
          <LikedPosts />
        </div>
      )}
    </div>
  );
};

export default Profile;