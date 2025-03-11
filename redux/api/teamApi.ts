import { Team } from "@/type/Index";
import { baseApi } from "./baseApi";

const TEAM = "/userTeam";

const TeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserTeam: builder.mutation<void, Partial<Team>>({
      query: (body) => ({
        url: `${TEAM}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTeam"], // Invalidate the list to refetch diagonostics
    }),
    getAllUserTeam: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team[];
      },
      void
    >({
      query: () => ({
        url: `${TEAM}/`,
      }),
      providesTags: ["getTeam"], // Provides tag for refetching when invalidated
    }),
    getAllRegisteredTeams: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team[];
      },
      { userId: string } // Query parameter
    >({
      query: ({ userId }) => ({
        url: `/team/get-all-joined-team-by-user/${userId}`, // Adjust API route accordingly
        method: "GET",
      }),
      providesTags: ["getTeam"], // Enables caching & refetching
    }),

    getUserTeamById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team;
      },
      { id: number }
    >({
      query: ({ id }) => ({
        url: `${TEAM}/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "getTeam", id }], // Tag specific to TEAM ID
    }),
    updateUserTeam: builder.mutation<void, { id: number; body: Partial<Team> }>(
      {
        query: ({ id, body }) => ({
          url: `${TEAM}/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [
          "getTeam",
          { type: "getTeam", id },
        ], // Invalidate both the list and the specific TEAM entry
      }
    ),
    deleteUserTeam: builder.mutation<void, number>({
      query: (id) => ({
        url: `${TEAM}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "getTeam",
        { type: "getTeam", id },
      ], // Invalidate both the list and the specific TEAM entry
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserTeamMutation,
  useGetAllRegisteredTeamsQuery,
  useGetAllUserTeamQuery,
  useGetUserTeamByIdQuery,
  useUpdateUserTeamMutation,
  useDeleteUserTeamMutation,
} = TeamApi;
