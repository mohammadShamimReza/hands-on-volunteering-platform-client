"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostIdQuery } from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostDetailsPage() {
  const params = useParams<{ slug: string }>();
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  const { data: postData, isLoading: getPostLoading } = useGetPostIdQuery({
    id: params.slug,
  });

  const post = postData?.data; // Extract post data

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
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-start gap-3"
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
                      <p className="text-xs text-gray-500 mt-1">
                        🕒 {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
