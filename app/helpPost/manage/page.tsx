"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAllPostByUserQuery,
} from "@/redux/api/postApi";
import { useGetAllTeamByUserIdQuery } from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { Post } from "@/type/Index";
import { useEffect, useState } from "react";

const ManagePostsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const { data: PostByUser } = useGetAllPostByUserQuery({
    userId: userData.id,
  });

  console.log(userData.id);
  console.log(PostByUser?.data);

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (PostByUser?.data) {
      setPosts(PostByUser.data);
    }
  }, [PostByUser]);

  const [isChecked, setIsChecked] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const { data: myAllTeams } = useGetAllTeamByUserIdQuery({
    userId: userData.id,
  });
  const myTeams = myAllTeams?.data;

  const [createPost] = useCreatePostMutation();

  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    description: "",
    urgency: "MEDIUM",
    status: "OPEN",
  });

  // 🔹 Validation State
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleCreatePost = async () => {
    let validationErrors: { title?: string; description?: string } = {};

    if (!newPost.title?.trim()) {
      validationErrors.title = "Title is required.";
    }
    if (!newPost.description?.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedPost: Partial<Post> = {
      ...newPost,
      createdById: isChecked ? undefined : userData.id, // If team is selected, remove user ID
      createdByTeamId: isChecked ? selectedTeam : undefined, // If not a team post, remove team ID
    };

    console.log(formattedPost, "post");
    try {
      const result = await createPost(formattedPost);
      console.log(result, "this is result");

      if (result) {
        setPosts((prevPosts) => [...prevPosts, formattedPost as Post]);
      }
    } catch (error) {
      console.log(error);
    }

    setNewPost({
      title: "",
      description: "",
      urgency: "MEDIUM",
      status: "OPEN",
    });
    setIsChecked(false);
    setSelectedTeam("");
    setErrors({});
  };

  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleDeletePost = async (id: string) => {
    try {
      const result = await deletePost(id);
      console.log(result);
      if (result) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
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
          <div>
            <Input
              type="text"
              placeholder="Post Title"
              value={newPost.title ?? ""}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description"
              value={newPost.description ?? ""}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* 🔹 Urgency Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency Level
            </label>
            <select
              className="border p-2 rounded-md w-full"
              value={newPost.urgency}
              onChange={(e) =>
                setNewPost((prev) => ({
                  ...prev,
                  urgency: e.target.value as Post["urgency"],
                }))
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* 🔹 Team Selection (Toggle) */}
          <div>
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Create post as a team?
              </span>
            </label>

            {isChecked && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Team *
                </label>
                <select
                  className="border p-2 rounded-md w-full"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">Select Team</option>
                  {myTeams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

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
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting" : "Delete"}
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
