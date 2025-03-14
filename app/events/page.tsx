"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllEventQuery } from "@/redux/api/eventApi";
import { Calendar, Filter, Loader2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const EventPage = () => {
  // 🔍 Filtering State
  const [filters, setFilters] = useState({
    category: "",
    location: "",
  });

  console.log(filters, "this is filters");

  // 🛠️ Fetching Events with Filters
  const { data: allEvents, isLoading } = useGetAllEventQuery(filters);

  console.log(allEvents);

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h1>

      {/* 🔍 Centered Filtering Section */}
      <div className="w-full flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Filter className="w-5 h-5 text-blue-500" /> Filter
          </h2>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* 📌 Category Filter */}
            <Select
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  category: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allEvents?.data
                  ?.map((event) => event.category)
                  .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
                  .map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* 📍 Location Filter */}
            <Input
              type="text"
              placeholder="Search by Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-md rounded-lg p-4">
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-4/5 mb-1" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-10 w-full mt-4" />
            </Card>
          ))}
        </div>
      )}

      {/* No Events Found */}
      {allEvents?.data.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">No events found.</p>
      )}

      {isLoading && <Loader2 />}

      {/* Event List */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-8">
          {allEvents?.data.map((event) => (
            <Card
              key={event.id}
              className="shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between h-full rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <CardHeader className=" dark:bg-gray-800 p-4 rounded-t-lg">
                <CardTitle className="text-lg md:text-xl font-semibold">
                  {event.title}
                </CardTitle>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(event.date).toLocaleDateString()} at{" "}
                  {event.time || "TBD"}
                </p>
              </CardHeader>

              <CardContent className="flex flex-col h-full p-5">
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                  {event.description || "No description available."}
                </p>

                <div className="space-y-1 text-sm font-medium">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {event.location || "Not specified"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    {event.requiredMembers} Members Required
                  </p>
                  <p className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs inline-block">
                    {event.category}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    asChild
                    className="text-sm md:text-base w-full bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    <Link href={`/events/${event.id}`}>See More</Link>
                  </Button>
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
