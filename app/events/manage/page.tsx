"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAllUserEventByUserQuery,
} from "@/redux/api/eventApi";
import { Loader2, Minus, Plus } from "lucide-react";
import { useGetAllTeamByUserIdQuery } from "@/redux/api/teamApi";

interface Event {
  id?: string;
  title: string;
  description?: string;
  date: string;
  endDateTime: string;
  time?: string;
  location?: string;
  category: string;
  requiredMembers: number;
  visibility: "PUBLIC" | "PRIVATE";
  createdById?: string;
  createdByTeamId?: string
}

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
  const { data: userCreateEvent, isLoading: userCreateEventLoading } =
    useGetAllUserEventByUserQuery({ userId: userData.id });

  const [createEvent, { isLoading: eventCreateLoading }] =
    useCreateEventMutation();

  
   const [deleteEvent, { isLoading: eventDeleteLoading }] =
     useDeleteEventMutation();
  
  const { data: myAllTeams } = useGetAllTeamByUserIdQuery({ userId: userData.id })

  const myTeams = myAllTeams?.data
  
  console.log(myTeams, 'my teams')
  


  
  
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    if (userCreateEvent) {
      setEvents(userCreateEvent.data as Event[]);
    }
  }, [userCreateEvent]);

  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    date: "",
    endDateTime: "",
    time: "",
    location: "",
    category: "",
    requiredMembers: 1,
    visibility: "PUBLIC", // Static value
    createdById: userData.id, // Automatically set from logged-in user
    createdByTeamId: ""
  });



  /**
   * Handles creating a new event.
   */
  const handleCreateEvent = async () => {
    console.log("Creating event...");

    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.endDateTime ||
      !newEvent.location ||
      !newEvent.category ||
      newEvent.requiredMembers < 1
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    delete newEvent.id

    try {
      const formattedEvent = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(), // Convert to ISO format
        endDateTime: new Date(newEvent.endDateTime).toISOString(), // Convert to ISO format
      };

          if (isChecked) {
            delete formattedEvent.createdById;
          } else {
            formattedEvent.createdById = userData.id;
          }


      const result = await createEvent(formattedEvent).unwrap();
      alert("Event created successfully!");
      console.log(result);

      // Reset form fields after event creation
     setNewEvent({
       id: "",
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
        const result = await deleteEvent(id)
        console.log(result)
      } catch (error) {
              alert("Failed to delete event. Please try again.");

      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      {/* Event Creation Form */}
      {createEventButton && (
        <Card className="max-w-2xl w-full mb-6">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <Input
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Description *
              </label>
              <Textarea
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <Input
                type="datetime-local"
                value={newEvent.endDateTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endDateTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Input
                type="text"
                placeholder="Enter location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Members *
              </label>
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
            </div>

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
        {userCreateEventLoading ? (
          <Loader2 />
        ) : (
          events?.map((event) => (
            <Card key={event.id} className="mb-4">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toDateString()} - {event.time || "TBD"}
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
  );
};

export default ManageEventsPage;
