"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetPostIdQuery,
} from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PostDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  // ✅ Fetch post data
  const { data: postData, isLoading: getPostLoading } = useGetPostIdQuery({
    id: params.slug,
  });

  const post = postData?.data; // Extract post data

  // ✅ Comment functionalities
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [comments, setComments] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentDeleteLoading, setCommentDeleteLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ If user is not logged in, show modal
  useEffect(() => {
    if (!userInfo) {
      setShowLoginModal(true);
    }
  }, [userInfo]);

  // ✅ Handle new comment submission
  const handleCommentSubmit = async () => {
    if (!userInfo?.id) {
      toast.error("Please login first");
      return;
    }

    const commentText = comments.trim();
    if (!commentText) return;

    setCommentLoading(true);

    try {
      await createComment({
        userId: userInfo.id,
        postId: post?.id,
        message: commentText,
      }).unwrap();

      setComments(""); // Clear input after submission
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment.");
    }

    setCommentLoading(false);
  };

  // ✅ Handle comment deletion
  const handleCommentDelete = async (commentId: string) => {
    setCommentDeleteLoading((prev) => ({ ...prev, [commentId]: true }));

    try {
      await deleteComment(commentId).unwrap();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    }

    setCommentDeleteLoading((prev) => ({ ...prev, [commentId]: false }));
  };

  // ✅ Loading state
  if (getPostLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 animate-pulse">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center text-gray-600">Post not found.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <p className="text-sm text-gray-500">{post.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Urgency Badge */}
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                post.urgency === "URGENT"
                  ? "bg-red-500 text-white"
                  : post.urgency === "MEDIUM"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-500 text-white"
              }`}
            >
              {post.urgency}
            </Badge>
          </div>

          {/* Status */}
          <p className="text-lg font-semibold">
            Status: <span className="text-blue-600">{post.status}</span>
          </p>

          {/* Creator */}
          <p className="text-sm text-gray-500">
            Created by:{" "}
            {post.createdById
              ? `User `
              : post.createdByTeamId
              ? `Team `
              : "Unknown"}
          </p>

          {/* Created & Updated Date */}
          <p className="text-xs text-gray-400">
            Created: {new Date(post.createdAt).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">
            Last Updated: {new Date(post.updatedAt).toLocaleString()}
          </p>

          {/* 🔵 Comments Section */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">💬 Comments</h2>
            {post.comments.length > 0 ? (
              <div className="max-h-40 overflow-y-auto  p-2 rounded-md mb-2">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 border rounded-md  flex items-start gap-3"
                  >
                    {/* Profile Image */}
                    <Image
                      src={comment.user.profileImage || "/default-avatar.png"}
                      alt={comment.user.fullName}
                      width={40}
                      height={40}
                      className="rounded-full border"
                    />

                    {/* Comment Content */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold hover:text-gray-400">
                        <Link href={`/user/${comment.user.id}`}>
                          {comment.user.fullName}
                        </Link>
                      </p>
                      <p className="text-sm  dark:text-gray-300">
                        {comment.message}
                      </p>
                    </div>

                    {/* Delete Button (Only for Own Comments) */}
                    {userInfo && comment.user.id === userInfo.id && (
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full"
            />
            <Button
              className="w-full sm:w-auto"
              onClick={handleCommentSubmit}
              disabled={commentLoading}
            >
              {commentLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Comment"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please Login</DialogTitle>
          </DialogHeader>
          <p>You need to be logged in to comment on posts.</p>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
