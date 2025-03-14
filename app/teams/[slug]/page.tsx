"use client";

import {
  useCreateRegisterTeamMutation,
  useGetEventByTeamIdQuery,
  useGetTeamByIdQuery,
} from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAllPostByTeamIdQuery } from "@/redux/api/postApi";
import { Calendar, Loader2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TeamPage() {
  const params = useParams<{ slug: string }>();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenPost, setIsDialogOpenPost] = useState(false);

  const { data: teamData, isLoading } = useGetTeamByIdQuery({
    teamId: params.slug,
  });
  const { data: eventData } = useGetEventByTeamIdQuery({ teamId: params.slug });

  const { data: postData } = useGetAllPostByTeamIdQuery({
    teamId: params.slug,
  });

  const team = teamData?.data;
  console.log(team, "event Data");

  const [joinTeam, { isLoading: isJoining }] = useCreateRegisterTeamMutation();

  const handleJoinTeam = async (id: string) => {
    try {
      const result = await joinTeam({ teamId: id, userId: userInfo.id });
      console.log(result);
      alert("You have successfully joined the team! ✅");
    } catch (error) {
      console.error("Error registering for team:", error);
      alert("Failed to join Team. Please try again.");
    }
  };

  const isUserJoined = team?.members?.some(
    (perticipant) => perticipant.userId === userInfo.id
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Team not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center  p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{team.name}</CardTitle>
          <CardDescription>{team.description}</CardDescription>
          <p className="text-sm text-gray-500 mt-1">
            Type: {team.type === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
          </p>
          <p className="text-sm font-semibold">
            Members: {team.members.map((member) => member.user.fullName)}
          </p>
          <br />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden">
                Open Events
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl w-full h-2/3 overflow-scroll">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  All Events
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {eventData?.data?.map((event) => (
                  <Card
                    key={event.id}
                    className="shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between h-full rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <CardHeader className=" dark:bg-gray-800 p-4 rounded-t-lg">
                      <CardTitle className="text-lg md:text-xl font-semibold">
                        {event.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {event.time || "TBD"}
                      </p>
                    </CardHeader>

                    <CardContent className="flex flex-col h-full p-5">
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {event.description || "No description available."}
                      </p>

                      <div className="space-y-1 text-sm font-medium">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {event.location || "Not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          {event.requiredMembers} Members Required
                        </p>
                        <p className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs inline-block">
                          {event.category}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 flex justify-between">
                        <Button
                          variant="outline"
                          asChild
                          className="text-sm md:text-base w-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                          <Link href={`/events/${event.id}`}>See More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpenPost} onOpenChange={setIsDialogOpenPost}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden">
                Open Post
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl w-full h-2/3 overflow-scroll">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  All Post
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {postData?.data?.map((event) => (
                  <Card
                    key={event.id}
                    className="shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between h-full rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <CardHeader className="bg-blue-50 dark:bg-gray-800 p-4 rounded-t-lg">
                      <CardTitle className="text-lg md:text-xl font-semibold">
                        {event.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col h-full p-5">
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {event.description || "No description available."}
                      </p>

                      <div className="space-y-1 text-sm font-medium">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {event.urgency}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 flex justify-between">
                        <Button
                          variant="outline"
                          asChild
                          className="text-sm md:text-base w-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                          <Link href={`/events/${event.id}`}>See More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
              Show All Events
            </Button>{" "}
            <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
              Show All Post
            </Button>{" "}
            <Button
              onClick={() => handleJoinTeam(team.id)}
              disabled={isUserJoined || isJoining}
            >
              {" "}
              {isJoining ? (
                <Loader2 className="animate-spin mr-2" />
              ) : isUserJoined ? (
                "Already Joined"
              ) : (
                "Join Team"
              )}{" "}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
