import { Event, UserEvent } from "@/type/Index";
import { baseApi } from "./baseApi";

const USEREVENT = "/userEvent";

const UserEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserEvent: builder.mutation<void, Partial<UserEvent>>({
      query: (body) => ({
        url: `${USEREVENT}/create`,
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
        url: `${USEREVENT}/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "UserEvent", id }], // Tag specific to USEREVENT ID
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
    deleteUserEvent: builder.mutation<void, number>({
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
  useCreateUserEventMutation,
  useGetAllRegisteredEventsQuery,
  useGetAllUserEventQuery,
  useGetUserEventByIdQuery,
  useUpdateUserEventMutation,
  useDeleteUserEventMutation,
} = UserEventApi;
