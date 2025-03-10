"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";

const teamTypeOptions = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
];

const mockTeams = [
  {
    id: "1",
    name: "Green Warriors",
    description:
      "A team dedicated to tree planting and environmental conservation.",
    type: "PUBLIC",
    createdBy: "Alice",
    members: 15,
  },
  {
    id: "2",
    name: "Food for All",
    description: "Helping distribute food to underprivileged communities.",
    type: "PRIVATE",
    createdBy: "Bob",
    members: 10,
  },
];

const TeamsPage = () => {
  const [teams, setTeams] = useState(mockTeams);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    type: "PUBLIC",
  });
  const [showForm, setShowForm] = useState(false);

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      type: newTeam.type,
      createdBy: "You",
      members: 1,
    };
    setTeams([...teams, newEntry]);
    setNewTeam({ name: "", description: "", type: "PUBLIC" });
    setShowForm(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Volunteer Teams</h1>
      <Button onClick={() => setShowForm(!showForm)} className="mb-6">
        {showForm ? "Cancel" : "Create a Team"}
      </Button>

      {showForm && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a New Team</h2>
          <Input
            type="text"
            placeholder="Team Name"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="mb-3"
          />
          <Input
            type="text"
            placeholder="Description"
            value={newTeam.description}
            onChange={(e) =>
              setNewTeam({ ...newTeam, description: e.target.value })
            }
            className="mb-3"
          />
          <Select
            options={teamTypeOptions}
            defaultValue={teamTypeOptions[0]}
            onChange={(selected) =>
              setNewTeam({ ...newTeam, type: selected?.value || "PUBLIC" })
            }
            className="mb-3"
          />
          <Button onClick={handleCreateTeam} className="w-full">
            Create Team
          </Button>
        </div>
      )}

      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="shadow-md flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {team.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Created By: {team.createdBy}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {team.type === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-700 mb-4">{team.description}</p>
                <p className="text-sm font-semibold">Members: {team.members}</p>
                <div className="flex justify-between mt-auto pt-4">
                  <Button variant="outline">View Team</Button>
                  <Button>Join Team</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
