"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLeaderboardQuery } from "@/redux/api/leaderboardApi";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const router = useRouter();

  // Fetch Data

  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useGetLeaderboardQuery();

  console.log(leaderboardData);

  // Redirect if not logged in
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

      {/* Leaderboard Section */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-center underline text-2xl">
            {" "}
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {leaderboardLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (leaderboardData?.data?.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {leaderboardData?.data?.map((user, index) => (
                <div
                  key={user.user.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    user.user.id === userData.id ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{index + 1}.</span>
                    <Image
                      src={user.user.profileImage || "/default-avatar.png"}
                      alt={user.user.fullName || "me"}
                      className="w-10 h-10 rounded-full border"
                      height={40}
                      width={40}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
