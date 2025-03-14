import { Leaderboard } from "@/type/Index";
import { baseApi } from "./baseApi";

const CONTRIBUTION = "/contribution";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogHours: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Leaderboard[];
      },
      void
    >({
      query: () => ({
        url: `${CONTRIBUTION}/log-hours`,
      }),
      // providesTags: ["getUser"], // Provides tag for refetching when invalidated
    }),
    getLeaderboard: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Leaderboard;
      },
      void
    >({
      query: (body) => ({
        url: `${CONTRIBUTION}/leaderboard`,
        body,
      }),
      // providesTags: (result, error, { id }) => [{ type: "User", id }], // Tag specific to USER ID
    }),
  }),
  overrideExisting: false,
});

export const { useGetLeaderboardQuery, useGetLogHoursQuery } = UserApi;
