"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllEventQuery } from "@/redux/api/eventApi";
import Link from "next/link";

const mockEvents = [
  {
    id: "1",
    title: "Beach Cleanup Drive",
    description:
      "Join us for a community beach cleanup event to help protect marine life.",
    date: "2025-04-15T10:00:00Z",
    time: "10:00 AM",
    location: "Santa Monica Beach, CA",
    category: "Environment",
    endDateTime: "2025-04-15T14:00:00Z",
    requiredMembers: 50,
    createdById: "user_123",
    visibility: "PUBLIC",
  },
  {
    id: "2",
    title: "Food Distribution for Homeless",
    description:
      "Help us distribute food packages to those in need in the downtown area.",
    date: "2025-05-02T12:00:00Z",
    time: "12:00 PM",
    location: "Downtown Community Center, NY",
    category: "Community",
    endDateTime: "2025-05-02T16:00:00Z",
    requiredMembers: 30,
    createdById: "user_456",
    visibility: "PUBLIC",
  },
  {
    id: "3",
    title: "Coding Workshop for Kids",
    description:
      "A fun and interactive workshop teaching kids the basics of coding.",
    date: "2025-06-10T09:00:00Z",
    time: "9:00 AM",
    location: "Tech Learning Hub, SF",
    category: "Education",
    endDateTime: "2025-06-10T13:00:00Z",
    requiredMembers: 20,
    createdById: "user_789",
    visibility: "PUBLIC",
  },
  {
    id: "4",
    title: "Beach Cleanup Drive",
    description:
      "Join us for a community beach cleanup event to help protect marine life.",
    date: "2025-04-15T10:00:00Z",
    time: "10:00 AM",
    location: "Santa Monica Beach, CA",
    category: "Environment",
    endDateTime: "2025-04-15T14:00:00Z",
    requiredMembers: 50,
    createdById: "user_123",
    visibility: "PUBLIC",
  },
  {
    id: "5",
    title: "Food Distribution for Homeless",
    description:
      "Help us distribute food packages to those in need in the downtown area.",
    date: "2025-05-02T12:00:00Z",
    time: "12:00 PM",
    location: "Downtown Community Center, NY",
    category: "Community",
    endDateTime: "2025-05-02T16:00:00Z",
    requiredMembers: 30,
    createdById: "user_456",
    visibility: "PUBLIC",
  },
];




const EventPage = () => {
  const { data: allEvents, isLoading } = useGetAllEventQuery(undefined);

  console.log(allEvents, 'this is all events')
  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h1>
      {allEvents?.data.length === 0 ? (
        <p className="text-center">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8">
          {allEvents?.data.map((event) => (
            <Card
              key={event.id}
              className="shadow-md flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {event.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} at{" "}
                  {event.time || "TBD"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-700 mb-4 line-clamp-3 dark:text-gray-400    ">
                  {event.description
                    ? event.description
                    : "No description available."}
                </p>
                <p className="text-sm font-semibold">
                  Location: {event.location || "Not specified"}
                </p>
                <p className="text-sm font-semibold">
                  Category: {event.category}
                </p>
                <p className="text-sm font-semibold">
                  Required Members: {event.requiredMembers}
                </p>
                <div className="flex justify-between mt-auto pt-4">
                  <Button
                    variant="outline"
                    asChild
                    className="text-sm md:text-base"
                  >
                    <Link href={`/events/${event.id}`}>See More</Link>
                  </Button>
                  <Button className="text-sm md:text-base">Join Event</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventPage;
