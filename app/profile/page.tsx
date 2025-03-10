"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";

interface User {
  fullName: string;
  email: string;
  bio: string;
  profileImage: string;
  skills: string[];
  causes: string[];
  eventsJoined: { id: string; title: string; date: string }[];
  teams: { id: string; name: string }[];
}

const skillsOptions = [
  "Academic",
  "Art",
  "Business",
  "Communication",
  "Computer",
  "Cooking",
  "Craft",
  "Creative",
  "Design",
  "Engineering",
  "Finance",
  "Health",
  "Language",
  "Leadership",
  "Legal",
  "Management",
  "Marketing",
  "Music",
  "Photography",
  "Programming",
  "Science",
  "Social",
].map((skill) => ({ label: skill, value: skill }));

const causesOptions = [
  "Animal",
  "Arts",
  "Children",
  "Community",
  "Crisis",
  "Culture",
  "Disability",
  "Disaster",
  "Education",
  "Employment",
  "Elderly",
  "Environment",
  "Health",
  "Human",
  "Humanitarian",
  "International",
  "Poverty",
  "Rights",
  "Social",
  "Sports",
  "Technology",
].map((cause) => ({ label: cause, value: cause }));



const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User>({
    fullName: "John Doe",
    email: "johndoe@example.com",
    bio: "Passionate about volunteering and making an impact.",
    profileImage: "/default-avater.png",
    skills: ["Communication", "Management"],
    causes: ["Education", "Environment"],
    eventsJoined: [
      { id: "1", title: "Beach Cleanup Drive", date: "2025-04-15" },
      { id: "2", title: "Food Distribution", date: "2025-05-02" },
    ],
    teams: [
      { id: "1", name: "Green Warriors" },
      { id: "2", name: "Food for All" },
    ],
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
    const [updatedUser, setUpdatedUser] = useState<User>({ ...user });
    

    const userData = useAppSelector((state) => state.auth.userInfo)
    

  const handleSave = () => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={userData.profileImage || "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full mb-4"
          />
          <CardTitle>{userData.fullName}</CardTitle>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                value={updatedUser.fullName}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, fullName: e.target.value })
                }
                placeholder="Full Name"
              />
              <Textarea
                value={updatedUser.bio}
                onChange={(e: any) =>
                  setUpdatedUser({ ...updatedUser, bio: e.target.value })
                }
                placeholder="Bio"
              />
              <Select
                isMulti
                options={skillsOptions}
                value={skillsOptions.filter((option) =>
                  updatedUser.skills.includes(option.value)
                )}
                onChange={(selected) =>
                  setUpdatedUser({
                    ...updatedUser,
                    skills: selected.map((s) => s.value),
                  })
                }
                placeholder="Select Skills"
              />
              <Select
                isMulti
                options={causesOptions}
                value={causesOptions.filter((option) =>
                  updatedUser.causes.includes(option.value)
                )}
                onChange={(selected) =>
                  setUpdatedUser({
                    ...updatedUser,
                    causes: selected.map((c) => c.value),
                  })
                }
                placeholder="Select Causes"
              />
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-gray-700">{userData.bio}</p>
              <p className="text-sm font-semibold">
                Skills: {userData.skills.join(", ")}
              </p>
              <p className="text-sm font-semibold">
                Causes: {userData.causes.join(", ")}
              </p>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volunteer History */}
      <section className="max-w-2xl w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Volunteer History</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          {user.eventsJoined.map((event) => (
            <p key={event.id} className="text-sm mb-2">
              ✔ {event.title} - {new Date(event.date).toDateString()}
            </p>
          ))}
        </div>
      </section>

      {/* Joined Teams */}
      <section className="max-w-2xl w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Joined Teams</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          {user.teams.map((team) => (
            <p key={team.id} className="text-sm mb-2">
              🔹 {team.name}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
