"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCertificate } from "@/components/utils/generateCertificate";
import {
  useCreateRegisterEventMutation,
  useGetEventByIdQuery,
} from "@/redux/api/eventApi";
import { useGetLogHoursQuery } from "@/redux/api/leaderboardApi";
import { useAppSelector } from "@/redux/hooks";
import { Calendar, Loader2, MapPin, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const certificateMilestones = [20, 50, 100]; // 🏅 Hours required for certificates

export default function EventDetailsPage() {
  const params = useParams<{ slug: string }>();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const userId = userInfo?.id; // Get userId from Redux state

  // Fetch event data
  const { data: event, isLoading } = useGetEventByIdQuery({ id: params.slug });
  const [registerEvent, { isLoading: isRegistering }] =
    useCreateRegisterEventMutation();
  const eventData = event?.data;

  const { data: logHoursData, isLoading: logHoursLoading } =
    useGetLogHoursQuery({ userId: userInfo.id, eventId: params.slug });

  const hoursVolunteered = logHoursData?.data?.hoursVolunteered || 0; // Default to 0

  console.log(logHoursData?.data.hoursVolunteered, "hour");

  // Check if the current user is already registered
  const isCurrentUserJoined = eventData?.participants?.some(
    (participant) => participant.userId === userId
  );

  console.log(isCurrentUserJoined, event);

  // ✅ Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ Confirm Join Event
  const confirmJoinEvent = async () => {
    try {
      const result = await registerEvent({
        userId,
        eventId: eventData?.id,
      }).unwrap();
      if (result?.error) {
        toast.error("Event joined successfull. Please try again letter!!");
      }

      if (result.data) {
        toast.success(
          `Event joined successfull! now you are the member of the event.`
        );
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to join event. Please try again.");
    }
  };

  const handleDownloadCertificate = (milestone: number) => {
    generateCertificate({
      fullName: userInfo.fullName,
      hours: milestone,
      eventTitle: eventData?.title || "No title",
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 animate-pulse">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  // Show not found message
  if (!eventData)
    return <div className="text-center text-gray-600">Event not found.</div>;

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h1 className="text-2xl text-center font-bold my-5 underline">
        {eventData.title}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {eventData.title}
          </CardTitle>
          <p className="text-sm text-gray-500">{eventData.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Event Date & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>
              {new Date(eventData.date).toDateString()} -{" "}
              {eventData.time || "TBD"}
            </span>
          </div>

          {/* Event Location */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>{eventData.location || "Location not specified"}</span>
          </div>

          {/* Required Members */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="w-5 h-5 text-green-500" />
            <span>Required Members: {eventData.requiredMembers}</span>
          </div>

          {/* Event Category */}
          <Badge variant="outline">{eventData.category}</Badge>
          <p className="font-semibold text-lg">
            ⏳ Hours Volunteered: {hoursVolunteered}
          </p>

          {/* Certificates */}
          {userInfo.id && (
            <div className="mt-5">
              <h2 className="text-lg font-bold mb-3">🎓 Certificates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {certificateMilestones.map((milestone) => (
                  <Button
                    key={milestone}
                    className={`w-full ${
                      hoursVolunteered >= milestone
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={hoursVolunteered < milestone}
                    onClick={() => handleDownloadCertificate(milestone)}
                  >
                    {hoursVolunteered >= milestone
                      ? `Download ${milestone}h Cert`
                      : `🔒 ${milestone}h Locked`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Visibility */}

          {/* Join Event Button */}
          <Button
            className="w-full mt-4"
            onClick={confirmJoinEvent}
            disabled={isCurrentUserJoined || isRegistering}
          >
            {isRegistering ? (
              <Loader2 className="animate-spin mr-2" />
            ) : isCurrentUserJoined ? (
              "Already Joined"
            ) : (
              "Join Event"
            )}
          </Button>
        </CardContent>
        <div className="p-5">
          <p className=" font-bold text-2xl underline mt-5">All Perticipents</p>
          <ol className="text-xl  list-decimal list-inside mt-2">
            {eventData?.participants?.map((user) => (
              <li key={user.userId}>{user.user.fullName}</li>
            ))}
          </ol>
        </div>
      </Card>

      {/* ❌ Please Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p>You need to log in to join this event.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Close
            </Button>
            <Button asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
