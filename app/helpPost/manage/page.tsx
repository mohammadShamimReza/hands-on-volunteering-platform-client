"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";

interface Post {
  id: string;
  title: string;
  description?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "CLOSED";
}

const demoPosts: Post[] = [
  {
    id: "1",
    title: "Need volunteers for shelter",
    description: "Urgent need for volunteers to assist at the shelter",
    urgency: "URGENT",
    status: "OPEN",
  },
  {
    id: "2",
    title: "Tutor kids on weekends",
    description: "Looking for volunteers to teach math and science",
    urgency: "MEDIUM",
    status: "OPEN",
  },
];

const ManagePostsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [newPost, setNewPost] = useState<Post>({
    id: "",
    title: "",
    description: "",
    urgency: "MEDIUM",
    status: "OPEN",
  });

  const handleCreatePost = () => {
    if (!newPost.title) return;
    setPosts([...posts, { ...newPost, id: Date.now().toString() }]);
    setNewPost({
      id: "",
      title: "",
      description: "",
      urgency: "MEDIUM",
      status: "OPEN",
    });
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Help Requests</h1>

      {/* Create Help Request */}
      <Card className="max-w-2xl w-full mb-6">
        <CardHeader>
          <CardTitle>Create New Help Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
          />
          <Button onClick={handleCreatePost}>Create Post</Button>
        </CardContent>
      </Card>

      {/* Display User's Help Requests */}
      <h2 className="text-xl font-bold mb-4">Your Help Requests</h2>
      <div className="w-full max-w-2xl">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No help requests created yet.
          </p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="mb-4">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{post.description}</p>
                <p className="text-sm text-gray-500">Urgency: {post.urgency}</p>
                <Button
                  onClick={() => handleDeletePost(post.id)}
                  variant="destructive"
                  className="mt-2"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePostsPage;
