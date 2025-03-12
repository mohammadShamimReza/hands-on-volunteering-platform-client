import { Event, UserEvent } from "@/type/Index";
import { baseApi } from "./baseApi";

const POST = "/post";

const UserEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<void, Partial<Event>>({
      query: (body) => ({
        url: `event/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getUserEvent"], // Invalidate the list to refetch diagonostics
    }),
    createRegisterEvent: builder.mutation<void, Partial<UserEvent>>({
      query: (body) => ({
        url: `event/register-event`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getUserEvent"], // Invalidate the list to refetch diagonostics
    }),
    getAllUserEvent: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event[];
      },
      void
    >({
      query: () => ({
        url: `${POST}/`,
      }),
      providesTags: ["getUserEvent"], // Provides tag for refetching when invalidated
    }),
    getAllEvent: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event[];
      },
      {
        category?: string;
        location?: string;
      }
    >({
      query: ({ category, location }) => ({
        url: `event/`,
        params: {
          category,
          location,
        },
      }),
      providesTags: ["getUserEvent"], // Enables refetching when invalidated
    }),

    getAllUserEventByUser: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event[];
      },
      { userId: string } // Query parameter
    >({
      query: ({ userId }) => ({
        url: `/event/get-event-created-user/${userId}`, // Adjust API route accordingly
      }),
      providesTags: ["getUserEvent"], // Provides tag for refetching when invalidated
    }),

    getAllRegisteredEvents: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event[];
      },
      { userId: string } // Query parameter
    >({
      query: ({ userId }) => ({
        url: `/event/get-registered-event-by-user/${userId}`, // Adjust API route accordingly
        method: "GET",
      }),
      providesTags: ["UserEvents"], // Enables caching & refetching
    }),

    getUserEventById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: UserEvent;
      },
      { id: number }
    >({
      query: ({ id }) => ({
        url: `${POST}/${id}`,
      }),
      providesTags: ['getUserEvent'], // Tag specific to POST ID
    }),
    getEventById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event;
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `event/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "UserEvent", id }], // Tag specific to POST ID
    }),
    updateUserEvent: builder.mutation<
      void,
      { id: number; body: Partial<UserEvent> }
    >({
      query: ({ id, body }) => ({
        url: `${POST}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific POST entry
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific POST entry
    }),
    deleteUserEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `${POST}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific POST entry
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEventMutation,
  useCreateRegisterEventMutation,
  useGetAllRegisteredEventsQuery,
  useGetAllEventQuery,
  useGetEventByIdQuery,
  useGetAllUserEventQuery,
  useGetAllUserEventByUserQuery,
  useGetUserEventByIdQuery,
  useUpdateUserEventMutation,
  useDeleteEventMutation,
  useDeleteUserEventMutation,
} = UserEventApi;
