"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetAllTeamByUserIdQuery,
} from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Team {
  id: string;
  name: string;
  description?: string;
  type: "PUBLIC" | "PRIVATE";
}

const ManageTeamsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const { data: teamByUserId, isLoading: teamByUserLoading } =
    useGetAllTeamByUserIdQuery({ userId: userData.id });

  const [teams, setTeams] = useState<Team[] | undefined>(undefined);

  useEffect(() => {
    if (teamByUserId?.data) {
      setTeams(teamByUserId.data);
    }
  }, [teamByUserId]);
  const [newTeam, setNewTeam] = useState<Team>({
    id: "",
    name: "",
    description: "",
    type: "PUBLIC",
  });

  console.log(teamByUserId?.data);

  const [createTeam, { isLoading: createTeamLoading }] =
    useCreateTeamMutation();

  const handleCreateTeam = async () => {
    if (!newTeam.name && !newTeam.description) {
      toast("Please give proper data", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
      return;
    }
    try {
      const result = await createTeam({
        name: newTeam.name,
        description: newTeam.description,
        type: "PUBLIC",
        createdById: userData.id,
      });
      if (result?.error) {
        toast("Team created is not succesfull", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      }
      if (result?.data) {
        toast("Team successfully");
        setNewTeam({
          id: "",
          name: "",
          description: "",
          type: "PUBLIC",
        });
      }
    } catch (error) {
      toast("Team creation failed! please try again letter", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    }
    // setTeams([...teams, { ...newTeam, id: Date.now().toString() }]);
    // setNewTeam({ id: "", name: "", description: "", type: "PUBLIC" });
  };

  const [deleteTeam] = useDeleteTeamMutation();

  const handleDeleteTeam = async (id: string) => {
    try {
      const result = await deleteTeam(id);
      console.log(result, "result");
      if (result?.error) {
        toast("Team delete is not succesfull", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      }
      if (result?.data) {
        toast("Team delete successfully");
        setNewTeam({
          id: "",
          name: "",
          description: "",
          type: "PUBLIC",
        });
      }
    } catch (error) {
      toast("Team deletion failed! please try again letter", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="">
      <Link
        className="flex w-32 gap-2 mt-10  p-2 rounded-2xl border-dotted border-2 "
        href={"/profile"}
      >
        <MoveLeft /> go profile
      </Link>
      <div className="w-full flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Teams</h1>
        <Toaster />

        {/* Create Team */}
        <Card className="max-w-2xl w-full mb-6">
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={newTeam.description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, description: e.target.value })
              }
            />
            <Button onClick={handleCreateTeam} disabled={createTeamLoading}>
              {createTeamLoading ? " craeting..." : "Create Team"}
            </Button>
          </CardContent>
        </Card>

        {/* Display User's Teams */}
        <h2 className="text-xl font-bold mb-4">Your Teams</h2>
        <div className="w-full max-w-2xl">
          {teamByUserLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : teams?.length === 0 ? (
            <p className="text-center text-gray-500">No teams created yet.</p>
          ) : (
            teams?.map((team) => (
              <Card key={team.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{team.description}</p>
                  <div className="flex justify-between mt-auto pt-4">
                    <Button
                      onClick={() => handleDeleteTeam(team.id)}
                      variant="destructive"
                      className="mt-2"
                    >
                      Delete
                    </Button>
                    <Button variant="outline">
                      {" "}
                      <Link href={`/teams/${team.id}`}>View Team</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeamsPage;
