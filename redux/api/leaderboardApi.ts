import { Leaderboard, User } from "@/type/Index";
import { baseApi } from "./baseApi";

const CONTRIBUTION = "/contribution";

interface UserStats {
  user: User;

  totalHours: number;
  totalPoints: number;
}

export type LogHoursData = {
  joinedAt: string; // When the user joined the event
  endDateTime: string; // When the event ends
  hoursVolunteered: number; // Total hours volunteered
  user: User; // User details including nested event info
};

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogHours: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: LogHoursData;
      },
      { userId: string; eventId: string }
    >({
      query: ({ userId, eventId }) => ({
        url: `${CONTRIBUTION}/log-hours`,
        params: {
          userId,
          eventId,
        },
      }),
      // providesTags: ["getUser"], // Provides tag for refetching when invalidated
    }),
    getUserHourById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: UserStats[];
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${CONTRIBUTION}/UserHour/${id}`,
      }),
      // providesTags: ["getUserEvent"], // Tag specific to POST ID
    }),
    getLeaderboard: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: Leaderboard[];
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

export const {
  useGetLeaderboardQuery,
  useGetUserHourByIdQuery,
  useGetLogHoursQuery,
} = UserApi;
