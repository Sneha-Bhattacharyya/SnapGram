import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { Comment } from "@/types";
import CommentItem from "./CommentItem";
import CommentInputBox from "./CommentInputBox";

const PostComments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchComments = async () => {
    try {
      const res = await axios.get("/comment", {
        params: { postId },
      });
      setComments(res.data as any[]); // should only be top-level comments
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <p className="text-light-4">Loading comments...</p>;
  if (comments.length === 0)
    return <p className="text-light-4">No comments yet</p>;

  return (
    <div className="w-full mt-10">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} fetchFunction={fetchComments}  />
      ))}
      <CommentInputBox postId={postId} fetchFunction={fetchComments} />
    </div>
  );
};

export default PostComments;
