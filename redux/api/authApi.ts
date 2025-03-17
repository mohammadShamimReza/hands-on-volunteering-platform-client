import { User } from "@/type/Index";
import { baseApi } from "./baseApi";

const AUTH = "/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        url: `${AUTH}/login`,
        method: "POST",
        body,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.data;
      },
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: `${AUTH}/signup`,
        method: "POST",
        body,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.data;
      },
    }),
    getUserById: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: User;
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `user/${id}`,
      }),
      // providesTags: ["getUserEvent"], // Tag specific to POST ID
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: `${AUTH}/me`,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.data;
      },
      providesTags: ["User"],
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: `${AUTH}/forgot-password`,
        method: "POST",
        body,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.data;
      },
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `${AUTH}/reset-password`,
        method: "POST",
        body, // Changed `data` to `body` for consistency
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.data;
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetUserInfoQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
