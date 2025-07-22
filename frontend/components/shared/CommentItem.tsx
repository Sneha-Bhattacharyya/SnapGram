import { useEffect, useState } from "react";
import { Comment } from "@/types";
import axios from "@/utils/axiosInstance";
import { multiFormatDateString } from "@/lib/utils";
import CommentInputBox from "./CommentInputBox";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui";
import Image from "next/image";

const CommentItem = ({
  comment,
  fetchFunction,
}: {
  comment: Comment;
  fetchFunction?: () => void;
}) => {
  const { user, loading } = useUser() ?? { user: null, loading: true };
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [genLoading, setGenLoading] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(
    comment.liked_by.some((u) => u.id === user?.id)
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchReplies = async () => {
    setGenLoading(true);
    try {
      const res = await axios.get(`/comment`, {
        params: {
          postId: comment.postId,
          parentCommentId: comment.id,
        },
      });
      setReplies(res.data as any[]);
    } catch (err) {
      console.error("Failed to fetch replies:", err);
    } finally {
      setGenLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
    console.log(`${isLiked ? "Unliked" : "Liked"} comment ${comment.id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/comment/${comment.id}`);
      if (response.status === 200) {
        toast.success("Comment deleted successfully");
        fetchFunction && fetchFunction();
      } else {
        toast.error("Could not delete comment");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-start gap-3">
        <img
          src={comment.author.dp_url || "/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col w-full">
          <div className="flex justify-between w-full">
            <p className="text-light-1 font-semibold">
              {comment.author.name}{" "}
              <span className="text-light-3 font-normal">{comment.body}</span>
            </p>

            {user?.id === comment.author.id && (
                <>
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="p-1 hover:bg-dark-4 rounded"
                    title="Delete"
                  >
                    <Image src="/icons/delete.svg" width={20} height={20} alt="Delete" />
                  </button>
                  {showDeleteDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-dark-2 p-6 rounded shadow-lg w-full max-w-xs">
                        <h2 className="text-lg font-semibold mb-2">Delete Comment</h2>
                        <p className="mb-4 text-light-3">
                          Are you sure you want to delete this comment? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            className="shad-button_primary"
                            onClick={() => setShowDeleteDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="shad-button_destructive"
                            onClick={async () => {
                              await handleDelete();
                              setShowDeleteDialog(false);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
            )}
          </div>

          <div className="flex gap-4 text-light-3 text-xs mt-1 items-center">
            <span>{multiFormatDateString(comment.timestamp)}</span>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setShowCommentInput(!showCommentInput)}
            >
              Reply
            </span>

            <button onClick={handleLikeToggle} className="hover:underline">
              {isLiked ? "Unlike" : "Like"}
            </button>

            {comment._count.replies > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="underline"
              >
                {showReplies
                  ? "Hide"
                  : `View ${comment._count.replies} replies`}
              </button>
            )}
          </div>
        </div>
      </div>

      {showCommentInput && (
        <div className="w-full mt-2" tabIndex={-1}>
          <CommentInputBox
            postId={comment.postId}
            parentCommentId={comment.id}
            fetchFunction={fetchReplies}
          />
        </div>
      )}

      {showReplies && (
        <div className="ml-12 mt-3 border-l border-dark-4 pl-4">
          {genLoading ? (
            <p className="text-light-4">Loading replies...</p>
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                fetchFunction={fetchReplies}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
