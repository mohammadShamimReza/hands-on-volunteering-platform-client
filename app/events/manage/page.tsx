"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAllUserEventByUserQuery,
} from "@/redux/api/eventApi";
import { useGetAllTeamByUserIdQuery } from "@/redux/api/teamApi";
import { useAppSelector } from "@/redux/hooks";
import { Event } from "@/type/Index";
import { Loader2, Minus, MoveLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const categories = [
  "Animal",
  "Arts",
  "Children",
  "Community",
  "Crisis",
  "Culture",
  "Disability",
  "Disaster",
  "Education",
  "Elderly",
  "Environment",
  "Health",
  "Human",
  "Humanitarian",
  "International",
  "Poverty",
  "Rights",
  "Social",
  "Sports",
  "Technology",
];

const ManageEventsPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [createEventButton, setCreateEventButton] = useState(false);

  const userData = useAppSelector((state) => state.auth.userInfo);
  const [eventLoading, setEventLoading] = useState(false);
  const { data: userCreateEvent, isLoading: userCreateEventLoading } =
    useGetAllUserEventByUserQuery({ userId: userData.id });
  const [createEvent, { isLoading: eventCreateLoading }] =
    useCreateEventMutation();
  const [deleteEvent, { isLoading: eventDeleteLoading }] =
    useDeleteEventMutation();

  const { data: myAllTeams } = useGetAllTeamByUserIdQuery({
    userId: userData.id,
  });

  const myTeams = myAllTeams?.data || [];

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEventLoading(true);

    if (userCreateEvent?.data) {
      setEvents(userCreateEvent.data);
    }
    setEventLoading(false);
  }, [userCreateEvent]);
  // 🔹 Ensure default values for newEvent
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    endDateTime: "",
    time: "",
    location: "",
    category: "",
    requiredMembers: 1,
    visibility: "PUBLIC",
    createdById: userData.id,
    createdByTeamId: "",
  });

  /**
   * Handles creating a new event.
   */
  const handleCreateEvent = async () => {
    console.log("Creating event...");

    if (
      !newEvent?.title ||
      !newEvent?.description ||
      !newEvent?.date ||
      !newEvent?.endDateTime ||
      !newEvent?.location ||
      !newEvent?.category ||
      newEvent?.requiredMembers! < 1
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formattedEvent = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(),
        endDateTime: new Date(newEvent.endDateTime).toISOString(),
      };

      if (isChecked) {
        formattedEvent.createdByTeamId = newEvent.createdByTeamId;
        delete formattedEvent.createdById;
      } else {
        formattedEvent.createdById = userData.id;
        delete formattedEvent.createdByTeamId;
      }

      console.log(formattedEvent, "formatedevent");

      const result = await createEvent(formattedEvent).unwrap();
      console.log(result);

      if (result?.error) {
        toast.error("Event created not successfull. Please try again letter!!");
      }

      if (result.data) {
        toast.success(
          `Event created successfull. ${
            formattedEvent.createdByTeamId &&
            "See in the team page for event or event page"
          }`
        );
        setNewEvent({
          title: "",
          description: "",
          date: "",
          endDateTime: "",
          time: "",
          location: "",
          category: "",
          requiredMembers: 1,
          visibility: "PUBLIC",
          createdById: userData.id,
          createdByTeamId: "",
        });
      }

      setCreateEventButton(false); // Close form after creation
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  /**
   * Handles deleting an event.
   */
  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const result = await deleteEvent(id);
        setEvents(events.filter((event) => event.id !== id)); // Remove from UI
        if (result?.error) {
          toast.error("Event Delete not successfull`!!");
        }

        if (result.data) {
          toast.success(`Event Deleted successfull. `);
        }
      } catch (error) {
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  return (
    <div className="">
      <Link
        className="flex w-32 gap-2 mt-10  p-2 rounded-2xl border-dotted border-2 "
        href={"/profile"}
      >
        <MoveLeft /> go profile
      </Link>
      <div className=" w-full flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

        {/* Event Creation Form */}
        {createEventButton && (
          <Card className="max-w-2xl w-full mb-6">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />

              <Textarea
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />

              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />

              <Input
                type="datetime-local"
                value={newEvent.endDateTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endDateTime: e.target.value })
                }
              />

              <Input
                type="text"
                placeholder="Enter location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />

              <select
                className="border p-2 rounded-md w-full"
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Enter number of required members"
                value={newEvent.requiredMembers}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    requiredMembers: Number(e.target.value),
                  })
                }
              />

              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Create event as a team?
                  </span>
                </label>

                {isChecked && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Create event as *
                    </label>
                    <select
                      className="border p-2 rounded-md w-full"
                      value={newEvent.createdByTeamId}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          createdByTeamId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Team</option>
                      {myTeams?.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <Button onClick={handleCreateEvent} disabled={eventCreateLoading}>
                {eventCreateLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Event"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setCreateEventButton(!createEventButton)}
          className="mb-2"
        >
          {createEventButton ? <Minus /> : <Plus />}{" "}
          {createEventButton ? "Close" : "Create Event"}
        </Button>

        <h2 className="text-xl font-bold mb-4">Your Created Events</h2>
        <div className="w-full max-w-2xl">
          {userCreateEventLoading || eventLoading ? (
            <Loader2 />
          ) : (
            events?.map((event) => (
              <Card key={event.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toDateString()} -{" "}
                    {event.time || "TBD"}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">
                    {event.description
                      ? event.description
                      : "No description provided."}
                  </p>
                  <p className="text-sm font-semibold">
                    📍 Location: {event.location || "Not specified"}
                  </p>
                  <p className="text-sm font-semibold">
                    📂 Category: {event.category}
                  </p>
                  <p className="text-sm font-semibold">
                    👥 Required Members: {event.requiredMembers}
                  </p>
                  <p className="text-sm font-semibold">
                    🔒 Visibility: {event.visibility}
                  </p>

                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleDeleteEvent(event?.id!!)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEventsPage;
