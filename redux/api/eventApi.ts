import { Event, UserEvent } from "@/type/Index";
import { baseApi } from "./baseApi";

const USEREVENT = "/userEvent";

const UserEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<{ data: any; error: any }, Partial<Event>>({
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
        url: `${USEREVENT}/`,
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
      providesTags: ["getUserEvent"], // Enables caching & refetching
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
        url: `${USEREVENT}/${id}`,
      }),
      providesTags: ["getUserEvent"], // Tag specific to USEREVENT ID
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
      providesTags: ["getUserEvent"], // Tag specific to USEREVENT ID
    }),
    updateUserEvent: builder.mutation<
      void,
      { id: number; body: Partial<UserEvent> }
    >({
      query: ({ id, body }) => ({
        url: `${USEREVENT}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific USEREVENT entry
    }),
    deleteEvent: builder.mutation<{ data: any; error: any }, string>({
      query: (id) => ({
        url: `event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific USEREVENT entry
    }),
    deleteUserEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `${USEREVENT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getUserEvent",
        { type: "UserEvent", id },
      ], // Invalidate both the list and the specific USEREVENT entry
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
