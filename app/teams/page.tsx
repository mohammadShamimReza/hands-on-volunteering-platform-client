"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllTeamQuery } from "@/redux/api/teamApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";



const TeamsPage = () => {
  const { data: teamData, isLoading: teamDataLoading } = useGetAllTeamQuery();

  console.log(teamData?.data);

  const [teams, setTeams] = useState(teamData?.data);
  useEffect(() => {
    if (teamData?.data) {
      setTeams(teamData?.data)
    }
  } ,[teamData])
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    type: "PUBLIC",
  });

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Volunteer Teams</h1>

      {teams?.length === 0 ? (
        <p>No teams found.</p>
      ) : teamDataLoading ? (
        <Loader2 />
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
              
                <div className="flex justify-between mt-auto pt-4">
                  <Button variant="outline">
                    {" "}
                    <Link href={`/teams/${team.id}`}>View Team</Link>
                  </Button>
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
