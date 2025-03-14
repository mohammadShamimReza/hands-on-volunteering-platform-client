"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import {
  useCreateRegisterTeamMutation,
  useGetAllTeamQuery,
} from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { Team } from "@/type/Index";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TeamsPage = () => {
  const { data: teamData, isLoading: teamDataLoading } = useGetAllTeamQuery();
  const userData = useAppSelector((state) => state.auth.userInfo);

  console.log(teamData);

  const [teams, setTeams] = useState(teamData?.data || []);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [joinTeam, { isLoading: joinTeamLoading }] =
    useCreateRegisterTeamMutation();

  useEffect(() => {
    if (teamData?.data) {
      setTeams(teamData.data);
    }
  }, [teamData]);

  /**
   * Opens the modal with the selected team details.
   */
  const openTeamModal = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const isJoined = selectedTeam?.members.some(
    (member) => member.user.id === userData.id
  );

  /**
   * Handles joining a team
   */
  const handleJoinTeam = async (teamId: string) => {
    if (!userData?.id) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const response = await joinTeam({ userId: userData.id, teamId }).unwrap();
      alert("Successfully joined the team!");
      console.log("Join Team Response:", response);

      // Update UI to mark the team as joined
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId ? { ...team, joined: true } : team
        )
      );

      // Close modal after joining
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error joining team:", error);
      alert("Failed to join the team. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Volunteer Teams</h1>
      <Toaster />
      {teamDataLoading ? (
        <Loader2 className="animate-spin" />
      ) : teams?.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8">
          {teams?.map((team) => (
            <Card
              key={team.id}
              className="shadow-md flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {team.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Type: {team.type === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-700 mb-4">{team?.description}</p>

                <div className="flex justify-center  mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openTeamModal(team)}
                  >
                    View Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔹 Team Info Modal */}
      {selectedTeam && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTeam.name}</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700">{selectedTeam.description}</p>
            <p className="text-sm text-gray-500">
              Type:{" "}
              {selectedTeam.type === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
            </p>
            <h3 className="font-semibold text-md mt-4">Team Posts</h3>
            <ul className="list-disc list-inside text-gray-700">
              {selectedTeam.post.length > 0 ? (
                selectedTeam.post.map((post) => (
                  <li key={post.id} className="text-sm text-gray-600">
                    {post.title}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No posts available.</p>
              )}
            </ul>

            {selectedTeam.type === "PUBLIC" && (
              <Button
                onClick={() => handleJoinTeam(selectedTeam.id)}
                disabled={joinTeamLoading || isJoined}
                className="w-full mt-4"
              >
                {joinTeamLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isJoined ? (
                  "Already Joined"
                ) : (
                  "Join Team"
                )}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamsPage;
