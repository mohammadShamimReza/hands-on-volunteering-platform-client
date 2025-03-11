import { User } from "@/type/Index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
  userInfo: User;
  authToken: string | null;
}

const initialState: AuthState = {
  userInfo: {
    id: "", // Empty (will be assigned upon creation)
    fullName: "User", // Default name
    email: "example@example.com", // Placeholder email
    password: "", // Empty (should be securely handled)
    bio: "", // Empty (user can update it)
    skills: [], // Empty (user can add skills)
    causes: [], // Empty (user can add causes)
    role: "USER", // Defaults to normal user
    profileImage:'', // Empty (user can upload)
    createdAt: new Date().toISOString(), // Default to current timestamp
    updatedAt: new Date().toISOString(),

    // Add missing properties with empty arrays or null
    eventsCreated: [],
    eventsJoined: [],
    teams: [],
    contributions: [],
    post: [],
    helpResponses: [],
    teamsCreated: [],
    leaderboard: [],
    certificates: [],
  },
  authToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
    storeAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { storeAuthToken, storeUserInfo, removeAuthToken } =
  authSlice.actions;
export default authSlice.reducer;
