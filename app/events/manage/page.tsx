"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  requiredMembers: number;
}

const demoEvents: Event[] = [
  {
    id: "1",
    title: "Beach Cleanup Drive",
    description: "Join us in cleaning up the beach to protect marine life.",
    date: "2025-04-15",
    time: "10:00 AM",
    location: "Santa Monica Beach, CA",
    category: "Environment",
    requiredMembers: 50,
  },
  {
    id: "2",
    title: "Food Distribution for Homeless",
    description:
      "Help us distribute food to those in need in the downtown area.",
    date: "2025-05-02",
    time: "12:00 PM",
    location: "Downtown Community Center, NY",
    category: "Community",
    requiredMembers: 30,
  },
  {
    id: "3",
    title: "Coding Workshop for Kids",
    description:
      "A fun and interactive workshop teaching kids the basics of coding.",
    date: "2025-06-10",
    time: "9:00 AM",
    location: "Tech Learning Hub, SF",
    category: "Education",
    requiredMembers: 20,
  },
];

const ManageEventsPage: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userInfo);
  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    requiredMembers: 1,
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setNewEvent({
      id: "",
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      requiredMembers: 1,
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <Card className="max-w-2xl w-full mb-6">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <Input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Required Members"
            value={newEvent.requiredMembers}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                requiredMembers: Number(e.target.value),
              })
            }
          />
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Your Events</h2>
      <div className="w-full max-w-2xl">
        {events.length === 0 ? (
          <p className="text-center text-gray-500">No events created yet.</p>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="mb-4">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="text-sm">Location: {event.location || "N/A"}</p>
                <p className="text-sm">
                  Required Members: {event.requiredMembers}
                </p>
                <Button
                  onClick={() => handleDeleteEvent(event.id)}
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

export default ManageEventsPage;
