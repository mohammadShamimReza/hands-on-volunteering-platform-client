"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";

interface Team {
  id: string;
  name: string;
  description?: string;
  type: "PUBLIC" | "PRIVATE";
}

const demoTeams: Team[] = [
  {
    id: "1",
    name: "Green Warriors",
    description: "Fighting for the environment",
    type: "PUBLIC",
  },
  {
    id: "2",
    name: "Food for All",
    description: "Helping those in need with food",
    type: "PUBLIC",
  },
];

const ManageTeamsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const [teams, setTeams] = useState<Team[]>(demoTeams);
  const [newTeam, setNewTeam] = useState<Team>({
    id: "",
    name: "",
    description: "",
    type: "PUBLIC",
  });

  const handleCreateTeam = () => {
    if (!newTeam.name) return;
    setTeams([...teams, { ...newTeam, id: Date.now().toString() }]);
    setNewTeam({ id: "", name: "", description: "", type: "PUBLIC" });
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Teams</h1>

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
          <Button onClick={handleCreateTeam}>Create Team</Button>
        </CardContent>
      </Card>

      {/* Display User's Teams */}
      <h2 className="text-xl font-bold mb-4">Your Teams</h2>
      <div className="w-full max-w-2xl">
        {teams.length === 0 ? (
          <p className="text-center text-gray-500">No teams created yet.</p>
        ) : (
          teams.map((team) => (
            <Card key={team.id} className="mb-4">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{team.description}</p>
                <Button
                  onClick={() => handleDeleteTeam(team.id)}
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

export default ManageTeamsPage;
