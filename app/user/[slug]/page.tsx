"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserByIdQuery } from "@/redux/api/authApi";
import { useGetAllRegisteredEventsQuery } from "@/redux/api/eventApi";
import { useGetUserHourByIdQuery } from "@/redux/api/leaderboardApi";
import { useGetAllRegisteredTeamsQuery } from "@/redux/api/teamApi";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const params = useParams<{ slug: string }>();

  // Fetch user stats (total hours and points)
  const { data: userStars, isLoading: statsLoading } = useGetUserHourByIdQuery({
    id: params.slug,
  });
  console.log(userStars);

  const userStar = userStars?.data;

  console.log(userStar);

  const { data: userInfo } = useGetUserByIdQuery({
    id: params.slug,
  });
  const userData = userInfo?.data;

  const { data: registeredEvents, isLoading: eventLoading } =
    useGetAllRegisteredEventsQuery({ userId: userData?.id || "" });

  const { data: registeredTeams, isLoading: teamLoading } =
    useGetAllRegisteredTeamsQuery({ userId: userData?.id || "" });

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      {/* Profile Card */}
      <Card className="max-w-2xl w-full shadow-md">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={userData?.profileImage || "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full mb-4 border shadow"
          />
          <CardTitle className="text-xl">{userData?.fullName}</CardTitle>
          <p className="text-sm text-gray-500">{userData?.email}</p>
        </CardHeader>
        <CardContent>
          {/* Bio Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">About Me</h2>
            <p className="text-gray-600">
              {userData?.bio || "No bio available."}
            </p>
          </div>

          {/* Skills Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {userData?.skills.length ? (
                userData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No skills added.</p>
              )}
            </div>
          </div>

          {/* Causes Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Causes I Support</h2>
            <div className="flex flex-wrap gap-2">
              {userData?.causes.length ? (
                userData.causes.map((cause, index) => (
                  <Badge key={index} variant="outline">
                    {cause}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No causes selected.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Volunteer Stats Section */}
      <section className="max-w-2xl w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Volunteer Stats</h2>
        <Card className="shadow-md">
          <CardContent className="flex justify-between items-center p-6">
            {statsLoading ? (
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            ) : (
              <div className="flex flex-col gap-3 text-lg">
                <p>
                  🕒 <span className="font-semibold">Total Hours:</span>{" "}
                  {userStar?.reduce((sum, user) => sum + user.totalHours, 0) ??
                    0}
                </p>
                <p>
                  ⭐ <span className="font-semibold">Total Points:</span>{" "}
                  {userStar?.reduce((sum, user) => sum + user.totalPoints, 0) ??
                    0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 🔹 Registered Events */}
      <section className="max-w-2xl w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Registered Events</h2>
        <Card className="shadow-sm">
          <CardContent>
            {eventLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : registeredEvents?.data.length ? (
              <ul className="space-y-2">
                {registeredEvents.data.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.id}`}
                      className="block p-2 rounded-md hover:bg-gray-100 transition"
                    >
                      ✔ {event.title} -{" "}
                      {new Date(event.endDateTime).toDateString()}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No registered events.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 🔹 Joined Teams */}
      <section className="max-w-2xl w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Joined Teams</h2>
        <Card className="shadow-sm">
          <CardContent>
            {teamLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : registeredTeams?.data.length ? (
              <ul className="space-y-2">
                {registeredTeams.data.map((team) => (
                  <li key={team.id}>
                    <Link
                      href={`/teams/${team.id}`}
                      className="block p-2 rounded-md hover:bg-gray-100 transition"
                    >
                      🔹 {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No joined teams.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ProfilePage;
