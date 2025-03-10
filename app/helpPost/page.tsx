"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockPosts = [
  {
    id: "1",
    title: "Winter Clothes Drive",
    description:
      "We need volunteers to distribute winter clothes to homeless people.",
    urgency: "HIGH",
    status: "OPEN",
    createdBy: "John Doe",
    comments: [
      { id: "101", user: "Alice", message: "I can help distribute clothes!" },
      { id: "102", user: "Bob", message: "Count me in!" },
    ],
  },
  {
    id: "2",
    title: "Food Bank Helpers Needed",
    description:
      "Looking for volunteers to help organize food at the local food bank.",
    urgency: "MEDIUM",
    status: "OPEN",
    createdBy: "Jane Smith",
    comments: [
      { id: "103", user: "Charlie", message: "I can join on weekends." },
    ],
  },
];

const CommunityHelpPage = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (postId: string) => {
    if (!comment.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now().toString(), user: "You", message: comment },
              ],
            }
          : post
      )
    );
    setComment("");
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Community Help Requests
      </h1>
      {posts.length === 0 ? (
        <p className="text-center">No help requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="shadow-md flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Urgency:{" "}
                  <span
                    className={`font-semibold ${
                      post.urgency === "HIGH"
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
                <p className="text-sm text-gray-500">
                  Created By:{" "}
                  <span className="font-semibold">{post.createdBy}</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {post.description}
                </p>
                <h3 className="text-md font-semibold">Comments:</h3>
                <div className="max-h-40 overflow-y-auto bg-gray-100 p-2 rounded-md mb-2">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <p key={comment.id} className="text-sm mb-1">
                        <strong className="text-blue-600">
                          {comment.user}:
                        </strong>{" "}
                        {comment.message}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-auto">
                  <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleCommentSubmit(post.id)}
                  >
                    Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityHelpPage;
