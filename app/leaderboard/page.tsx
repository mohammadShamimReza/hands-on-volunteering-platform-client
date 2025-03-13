"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetLeaderboardQuery,
  useGetLogHoursQuery,
} from "@/redux/api/leaderboardApi";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const certificateMilestones = [20, 50, 100]; // 🏅 Hours required for certificates

const page = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const router = useRouter();

  // ✅ Fetch Log Hours
  const { data: logHoursData, isLoading: logHoursLoading } =
    useGetLogHoursQuery();

  // ✅ Fetch Leaderboard Data
  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useGetLeaderboardQuery();

  // 🔐 If user is not logged in, redirect to login
  if (!userData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Card className="p-6 text-center">
          <CardTitle className="text-lg font-bold">Login Required</CardTitle>
          <p className="text-gray-500 mt-2">
            Please login to track your volunteer hours.
          </p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Volunteer Impact Tracking
      </h1>

      {/* 🔹 Volunteer Hours Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Logged Hours</CardTitle>
        </CardHeader>
        <CardContent>
          {logHoursLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : logHoursData?.data ? (
            <div className="text-center text-xl font-semibold">
              {/* ⏳ {logHoursData.data.hoursVolunteered} Hours Logged */}
            </div>
          ) : (
            <p className="text-center text-gray-500">No hours logged yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Certificates Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Certificates Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            {/* {certificateMilestones.map((milestone) => (
              <div key={milestone} className="flex flex-col items-center">
                <Medal className="w-10 h-10 text-yellow-500" />
                <p className="text-sm font-medium mt-2">
                  {logHoursData?.data?.hoursVolunteered >= milestone
                    ? `🏅 Achieved ${milestone} Hours`
                    : `🔜 ${milestone} Hours`}
                </p>
              </div>
            ))} */}
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Leaderboard Section */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* {leaderboardLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : leaderboardData?.data?.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.data.map((user, index) => (
                <div
                  key={user.user.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    user.user.id === userData.id ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{index + 1}.</span>
                    <img
                      src={user.user.profileImage || "/default-avatar.png"}
                      alt={user.user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{user.user.fullName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ⏳ {user.totalHours} Hours
                    </p>
                    <p className="text-xs text-gray-500">
                      ⭐ {user.totalPoints} Points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No leaderboard data available.
            </p>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
