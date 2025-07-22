import { Post } from "@/types";
import Link from "next/link";
import PostStats from "./PostStats";
import { useUser } from "@/providers/AuthProvider";

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: {
    posts: Post[];
    showUser?: boolean;
    showStats?: boolean;
}) => {
  const { user, loading } = useUser() ?? { user: null, loading: true };
  console.log("Received posts:", posts);
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link href={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.media_url}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.owner.dp_url ||
                    "/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.owner.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user?.id || ""} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;