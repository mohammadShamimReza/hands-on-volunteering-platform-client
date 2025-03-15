"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllRegisteredEventsQuery } from "@/redux/api/eventApi";
import { useGetAllRegisteredTeamsQuery } from "@/redux/api/teamApi";
import { useUpdateUserMutation } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/type/Index";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Select from "react-select";



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

  const userData = useAppSelector((state) => state.auth.userInfo)
  const { data: getUserAllregisteredEvent, isLoading: eventLoading } =
    useGetAllRegisteredEventsQuery({ userId: userData?.id });
  const { data: getUserAllRegisteredTeam, isLoading: teamLoading } =
    useGetAllRegisteredTeamsQuery({
      userId: userData?.id,
    });

  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({
    bio: userData?.bio,
    fullName: userData?.fullName,
    skills: userData?.skills,
    causes: userData?.causes,
  });

  useEffect(() => {
    if (userData) {
      setUpdatedUser({
        bio: userData.bio,
        fullName: userData.fullName,
        skills: userData.skills,
        causes: userData.causes,
      });
    }
  }, [userData]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const handleSave = async () => {
    console.log(updatedUser, "update user data");
    try {
      const result = await updateUser({
        id: userData?.id,
        body: updatedUser, // Pass the correct object
      }).unwrap();
      console.log(result, "this is update user");
    } catch (error) {}
    // setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={userData?.profileImage || "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full mb-4"
          />
          <CardTitle>{userData?.fullName}</CardTitle>
          <p className="text-sm text-gray-500">{userData?.email}</p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                value={updatedUser?.fullName}
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
                  updatedUser?.skills?.includes(option.value)
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
                  updatedUser?.causes?.includes(option.value)
                )}
                onChange={(selected) =>
                  setUpdatedUser({
                    ...updatedUser,
                    causes: selected.map((c) => c.value),
                  })
                }
                placeholder="Select Causes"
              />
              <Button onClick={handleSave} disabled={updateUserLoading}>
                {updateUserLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="">{userData?.bio}</p>
              <p className="text-sm font-semibold">
                Skills: {userData?.skills.join(", ")}
              </p>
              <p className="text-sm font-semibold">
                Causes: {userData?.causes.join(", ")}
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                disabled={updateUserLoading}
              >
                {" "}
                {updateUserLoading ? "Updating..." : "Edit Profile"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRUD Section for Events, Teams, and Posts */}
      <section className="max-w-2xl w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Manage Your Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button asChild>
            <a href="/events/manage">Manage Events</a>
          </Button>
          <Button asChild>
            <a href="/teams/manage">Manage Teams</a>
          </Button>
          <Button asChild>
            <a href="/helpPost/manage">Manage Posts</a>
          </Button>
        </div>
      </section>

      {/* Volunteer History */}
      <section className="max-w-2xl w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Registerd Events</h2>
        <div className="border p-4 rounded-md">
          {eventLoading ? (
            <Loader2 />
          ) : (
            getUserAllregisteredEvent?.data?.map((userEvent) => (
              <div className="" key={userEvent.id}>
                <Link
                  href={`/events/${userEvent.id}`}
                  className="text-sm mb-2 hover:bg-gray-200 hover:dark:border-gray-600"
                >
                  ✔ {userEvent.title} -{" "}
                  {new Date(userEvent.endDateTime).toDateString()}
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Joined Teams */}
      <section className="max-w-2xl w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Joined Teams</h2>
        <div className="border p-4 rounded-md">
          {teamLoading ? (
            <Loader2 />
          ) : (
            getUserAllRegisteredTeam?.data?.map((team) => (
              <div className="" key={team.id}>
                <Link
                  href={`/teams/${team.id}`}
                  className="text-sm mb-2  hover:bg-gray-200 hover:dark:border-gray-600"
                >
                  🔹 {team.name}
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
