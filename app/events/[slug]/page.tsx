"use client";

import { useGetEventByIdQuery } from "@/redux/api/eventApi";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Users, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";

export default function EventDetailsPage() {
  const params = useParams<{ slug: string }>();
    const userInfo = useAppSelector((state) => state.auth.userInfo)
    const userId = userInfo.id
  // Fetch event data
  const { data: event, isLoading } = useGetEventByIdQuery({
    id: params.slug,
  });
    
    const eventData = event?.data


    const isCurrentUserJoined = eventData?.participants.filter((user) => user.userId === userId)
    console.log(userId, eventData, isCurrentUserJoined, "joined")

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
          <h1 className="text-2xl text-center font-bold my-5 underline">The greate event</h1>
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

          {/* Action Button */}
          <Button className="w-full mt-4">
            {isCurrentUserJoined?.length === 0 ? "Join Event" : "Already member"}{" "}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
