import { User } from "@/type/Index";
import { baseApi } from "./baseApi";

const USER = "/user";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: User[];
      },
      void
    >({
      query: () => ({
        url: `${USER}/`,
      }),
      providesTags: ["getUser"], // Provides tag for refetching when invalidated
    }),

    updateUser: builder.mutation<void, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `${USER}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"], // Invalidate user cache to trigger a re-fetch
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `${USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["getUser", { type: "User", id }], // Invalidate both the list and the specific USER entry
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllUserQuery, useUpdateUserMutation, useDeleteUserMutation } =
  UserApi;
