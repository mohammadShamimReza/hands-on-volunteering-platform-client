"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetAllPostQuery,
} from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CommunityHelpPage = () => {
  const router = useRouter();
  const { data: allPost, isLoading } = useGetAllPostQuery();
  const posts = allPost?.data;

  const userData = useAppSelector((state) => state.auth.userInfo);
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentDeleteLoading, setCommentDeleteLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!userData) {
      setShowLoginModal(true);
    }
  }, [userData]);

  const handleCommentChange = (postId: string, text: string) => {
    setComments((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!userData.id) {
      toast.error("Please login first");
      return;
    }

    const comment = comments[postId]?.trim();
    if (!comment) return;

    setCommentLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const result = await createComment({
        userId: userData.id,
        postId: postId,
        message: comment,
      }).unwrap();

      console.log(result, "Comment Submitted");

      setComments((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }

    setCommentLoading((prev) => ({ ...prev, [postId]: false }));
  };

  // Handle comment deletion
  const handleCommentDelete = async (commentId: string) => {
    setCommentDeleteLoading((prev) => ({ ...prev, [commentId]: true }));

    try {
      const result = await deleteComment(commentId).unwrap();
      console.log(result, "Comment Deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }

    setCommentDeleteLoading((prev) => ({ ...prev, [commentId]: false }));
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Community Help Requests
      </h1>
      <Toaster />

      {isLoading && <Loader2 className="animate-spin" />}

      {posts?.length === 0 ? (
        <p className="text-center">No help requests found.</p>
      ) : (
        <div className="w-full max-w-4xl px-4">
          {posts?.map((post) => (
            <Card key={post.id} className="shadow-md mb-10">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Urgency:{" "}
                  <span
                    className={`font-semibold ${
                      post.urgency === "URGENT"
                        ? "text-red-500"
                        : post.urgency === "MEDIUM"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {post.urgency}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-semibold">{post.status}</span>
                </p>
              </CardHeader>

              <CardContent>
                <p className=" mb-4">{post.description}</p>

                <h3 className="text-md font-semibold mb-2">Comments:</h3>
                <div className="max-h-40 overflow-y-auto bg-gray-100 p-2 rounded-md mb-2">
                  {post.comments?.length > 0 ? (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <p className="text-sm">
                          <strong className="text-blue-600">
                            {comment.user.fullName}:
                          </strong>{" "}
                          {comment.message}
                        </p>
                        {/* 🔹 Show Delete Button Only for Current User */}
                        {userData && comment.user.id === userData.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCommentDelete(comment.id)}
                            disabled={commentDeleteLoading[comment.id]}
                          >
                            {commentDeleteLoading[comment.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            )}
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={comments[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    className="w-full"
                  />
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={commentLoading[post.id]}
                  >
                    {commentLoading[post.id] ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Comment"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔹 Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please Login</DialogTitle>
          </DialogHeader>
          <p className="">You need to be logged in to comment on posts.</p>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityHelpPage;
