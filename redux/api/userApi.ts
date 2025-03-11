import { User } from "@/type/Index";
import { baseApi } from "./baseApi";

const USER = "/user";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<void, Partial<User>>({
      query: (body) => ({
        url: `${USER}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getUser"], // Invalidate the list to refetch diagonostics
    }),
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
    getUserById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: User;
      },
      { id: number }
    >({
      query: ({ id }) => ({
        url: `${USER}/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "User", id }], // Tag specific to USER ID
    }),
    updateUser: builder.mutation<
      void,
      { id: number; body: Partial<User> }
    >({
      query: ({ id, body }) => ({
        url: `${USER}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "getUser",
        { type: "User", id },
      ], // Invalidate both the list and the specific USER entry
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `${USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getUser",
        { type: "User", id },
      ], // Invalidate both the list and the specific USER entry
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UserApi;
