"use client";

import { useState } from "react";
import {
  useCreateRegisterEventMutation,
  useGetEventByIdQuery,
} from "@/redux/api/eventApi";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Users, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventDetailsPage() {
  const params = useParams<{ slug: string }>();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const userId = userInfo?.id; // Get userId from Redux state

  // Fetch event data
    const { data: event, isLoading } = useGetEventByIdQuery({ id: params.slug });
    console.log(event)
  const [registerEvent, { isLoading: isRegistering }] =
    useCreateRegisterEventMutation();
  const eventData = event?.data;

  // Check if the current user is already registered
  const isCurrentUserJoined = eventData?.participants?.some(
    (participant) => participant.userId === userId
  );
   

  // ✅ Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 🛠️ Handle Join Event Click
  const handleJoinEvent = () => {
    if (!userId) {
      setShowLoginModal(true); // If user not logged in, show login modal
    } else {
      setShowConfirmModal(true); // Show confirmation modal
    }
  };

  // ✅ Confirm Join Event
  const confirmJoinEvent = async () => {
    try {
      await registerEvent({ userId, eventId: eventData?.id }).unwrap();
      setShowConfirmModal(false);
      alert("You have successfully joined the event! ✅");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to join event. Please try again.");
    }
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

          {/* Visibility */}
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-5 h-5 text-gray-600" />
            <span
              className={`font-medium ${
                eventData.visibility === "PUBLIC"
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {eventData.visibility}
            </span>
          </div>

          {/* Join Event Button */}
          <Button
            className="w-full mt-4"
            onClick={handleJoinEvent}
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
            {eventData?.participants?.map((user, index) => (
              <li key={user.userId}>{user.user.fullName}</li>
            ))}
          </ol>
        </div>
      </Card>

      {/* ✅ Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Event</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to join this event?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => confirmJoinEvent()} disabled={isRegistering}>
              {isRegistering ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
