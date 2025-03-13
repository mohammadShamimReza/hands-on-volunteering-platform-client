import { Comment, Event, Post, UserEvent } from "@/type/Index";
import { baseApi } from "./baseApi";

const POST = "/post";

const PostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<void, Partial<Post>>({
      query: (body) => ({
        url: `${POST}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getPost"], // Invalidate the list to refetch diagonostics
    }),
    createComment: builder.mutation<void, Partial<Comment>>({
      query: (body) => ({
        url: `comment/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getPost"], // Invalidate the list to refetch diagonostics
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
    getAllPost: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Post[];
      },
      void
    >({
      query: () => ({
        url: `post/`,
      }),
      providesTags: ["getPost"], // Enables refetching when invalidated
    }),

    getAllPostByUser: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Post[];
      },
      { userId: string } // Query parameter
    >({
      query: ({ userId }) => ({
        url: `${POST}/user/${userId}`, // Adjust API route accordingly
      }),
      providesTags: ["getPost"], // Provides tag for refetching when invalidated
    }),

    getAllPostByTeamId: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Post[];
      },
      { teamId: string } // Query parameter
    >({
      query: ({ teamId }) => ({
        url: `${POST}/team/${teamId}`, // Adjust API route accordingly
      }),
      providesTags: ["getPost"], // Provides tag for refetching when invalidated
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
      providesTags: ["getUserEvent"], // Tag specific to POST ID
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
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `${POST}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getPost"], // Invalidate both the list and the specific POST entry
    }),
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getPost"], // Invalidate both the list and the specific POST entry
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePostMutation,
  useCreateRegisterEventMutation,
  useGetAllPostQuery,
  useGetEventByIdQuery,
  useCreateCommentMutation,
  useGetAllUserEventQuery,
  useGetAllPostByTeamIdQuery,
  useGetAllPostByUserQuery,
  useGetUserEventByIdQuery,
  useUpdateUserEventMutation,
  useDeleteEventMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
} = PostApi;
