import { Event, Team, TeamMember } from "@/type/Index";
import { baseApi } from "./baseApi";

const TEAM = "/userTeam";

const TeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation<void, Partial<Team>>({
      query: (body) => ({
        url: `team/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTeam"], // Invalidate the list to refetch diagonostics
    }),
    createRegisterTeam: builder.mutation<void, Partial<TeamMember>>({
      query: (body) => ({
        url: `team/register-team`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getUserTeam"], // Invalidate the list to refetch diagonostics
    }),
    getAllTeam: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team[];
      },
      void
    >({
      query: () => ({
        url: `team`,
      }),
      providesTags: ["getTeam"], // Provides tag for refetching when invalidated
    }),
    getTeamById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team;
      },
      { teamId: string }
    >({
      query: ({ teamId }) => ({
        url: `team/${teamId}`,
      }),
      providesTags: ["getTeam", "getUserTeam"], // Provides tag for refetching when invalidated
    }),
    getEventByTeamId: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Event[];
      },
      { teamId: string }
    >({
      query: ({ teamId }) => ({
        url: `team/events/${teamId}`,
      }),
      providesTags: ["getTeam", "getUserTeam"], // Provides tag for refetching when invalidated
    }),
    getAllTeamByUserId: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Team[];
      },
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `team/user/${userId}`,
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
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `team/${id}`,
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
  useCreateTeamMutation,
  useGetAllTeamQuery,
  useCreateRegisterTeamMutation,
  useGetEventByTeamIdQuery,
  useGetTeamByIdQuery,
  useGetAllRegisteredTeamsQuery,
  useGetAllTeamByUserIdQuery,
  useGetUserTeamByIdQuery,
  useUpdateUserTeamMutation,
  useDeleteTeamMutation,
} = TeamApi;
