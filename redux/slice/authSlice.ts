import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  skills: string[];
  causes: string[];
  role: "USER" | "ADMIN"; // Assuming roles can be USER or ADMIN
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  userInfo: UserInfo;
  authToken: string | null;
}

const initialState: AuthState = {
  userInfo: {
    id: "", // Empty (will be assigned upon creation)
    fullName: " User", // Default name
    email: "example@example.com", // Placeholder email
    password: "", // Empty (should be securely handled)
    bio: "", // Empty (user can update it)
    skills: [], // Empty (user can add skills)
    causes: [], // Empty (user can add causes)
    role: "USER", // Defaults to normal user
    profileImage: null, // Empty (user can upload)
    createdAt: new Date().toISOString(), // Default to current timestamp
    updatedAt: new Date().toISOString(),
  },
  authToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeUserInfo: (state, action: PayloadAction<UserInfo>) => {
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
