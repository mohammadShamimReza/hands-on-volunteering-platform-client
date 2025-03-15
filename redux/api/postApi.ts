import { Comment, Post } from "@/type/Index";
import { baseApi } from "./baseApi";

const POST = "/post";

const PostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<{ data: any; error: any }, Partial<Post>>({
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

    getPostId: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Post;
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${POST}/${id}`,
      }),
      // providesTags: ["getUserEvent"], // Tag specific to POST ID
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
  // overrideExisting: false,
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useCreateCommentMutation,
  useGetAllPostByTeamIdQuery,
  useGetPostIdQuery,
  useGetAllPostByUserQuery,
  useDeletePostMutation,
  useDeleteCommentMutation,
} = PostApi;
