"use client";

import MainPage from "@/components/contants/MainPage";
import { LoadingSpinner } from "@/components/ui/loading";
import { getTokenFromCookie } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useAppDispatch();
  const tokenFromLocalStorage = useMemo(() => {
    // Only access localStorage if running in the browser
    if (typeof window !== "undefined") {
      return getTokenFromCookie();
    }
    return null;
  }, []);

  const { data: userData, isLoading } = useGetUserInfoQuery({ undefined });

  // Set initial mount state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Store token in Redux if available
  useEffect(() => {
    if (tokenFromLocalStorage) {
      dispatch(storeAuthToken(tokenFromLocalStorage));
    }
  }, [tokenFromLocalStorage, dispatch]);

  // Store user data in Redux when available
  useEffect(() => {
    if (userData) {
      dispatch(storeUserInfo(userData?.data));
    }
  }, [userData, dispatch]);

  // Render a loading message if not mounted
  if (!isMounted && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <MainPage />;
}
