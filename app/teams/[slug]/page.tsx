"use client";

import { useCreateRegisterTeamMutation, useCreateTeamMutation, useGetTeamByIdQuery } from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

export default function TeamPage() {
  const params = useParams<{ slug: string }>();
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  const { data: teamData, isLoading } = useGetTeamByIdQuery({
    teamId: params.slug,
  });
    const team = teamData?.data;
    
    const [joinTeam, { isLoading: isJoining }] =
      useCreateRegisterTeamMutation();

    const handleJoinTeam = async (id: string) => {
        try {
            const result = await joinTeam({ teamId: id, userId: userInfo.id });
            console.log(result)
                  alert("You have successfully joined the team! ✅");

        } catch (error) {
               console.error("Error registering for team:", error);
               alert("Failed to join Team. Please try again.");
        }
    }

    const isUserJoined = team?.members?.some((perticipant) => perticipant.userId === userInfo.id)

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
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mt-4">
            <Button variant="outline">View Team</Button>
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
