"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllTeamByUserIdQuery } from "@/redux/api/teamApi";
import { useGetAllPostByUserQuery } from "@/redux/api/postApi";

interface Post {
  id: string;
  title: string;
  description?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "CLOSED";
  createdById?: string; // User ID (if created by a user)
  createdByTeamId?: string; // Team ID (if created by a team)
}

const demoPosts: Post[] = [
  {
    id: "1",
    title: "Need volunteers for shelter",
    description: "Urgent need for volunteers to assist at the shelter",
    urgency: "URGENT",
    status: "OPEN",
    createdById: "user_1",
  },
  {
    id: "2",
    title: "Tutor kids on weekends",
    description: "Looking for volunteers to teach math and science",
    urgency: "MEDIUM",
    status: "OPEN",
    createdByTeamId: "team_1",
  },
];

const ManagePostsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const { data: PostByUser } = useGetAllPostByUserQuery({ userId: userData.id })

  console.log(userData.id)
  
  console.log(PostByUser)
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const { data: myAllTeams } = useGetAllTeamByUserIdQuery({
    userId: userData.id,
  });
  const myTeams = myAllTeams?.data;

  const [newPost, setNewPost] = useState<Post>({
    id: "",
    title: "",
    description: "",
    urgency: "MEDIUM",
    status: "OPEN",
    createdById: userData.id, // Default: Created by user
    createdByTeamId: undefined,
  });

  // 🔹 Validation State
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleCreatePost = () => {
    let validationErrors: { title?: string; description?: string } = {};

    if (!newPost.title.trim()) {
      validationErrors.title = "Title is required.";
    }
    if (!newPost.description?.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedPost: Post = {
      ...newPost,
      id: Date.now().toString(),
      createdById: isChecked ? undefined : userData.id, // If team is selected, remove user ID
      createdByTeamId: isChecked ? selectedTeam : undefined, // If not a team post, remove team ID
    };

    console.log("New Post Data:", formattedPost); // ✅ Logs post data to console

    setPosts([...posts, formattedPost]);
    setNewPost({
      id: "",
      title: "",
      description: "",
      urgency: "MEDIUM",
      status: "OPEN",
      createdById: userData.id, // Reset to user-created by default
      createdByTeamId: undefined,
    });

    setIsChecked(false);
    setSelectedTeam("");

    setErrors({});
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
          <div>
            <Input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
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
                setNewPost({
                  ...newPost,
                  urgency: e.target.value as Post["urgency"],
                })
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
                <p className="text-sm text-gray-500">
                  {post.createdById ? `Posted by User` : `Posted by Team`}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{post.description}</p>
                <p className="text-sm text-gray-500">
                  Urgency: <span className="font-semibold">{post.urgency}</span>
                </p>
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
