"use client";

import MainPage from "@/components/MainPage";
import { LoadingSpinner } from "@/components/ui/loading";
import { getTokenFromCookie } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);




  // Set initial mount state
  useEffect(() => {
    setIsMounted(true);
  }, []);

 

  // Render a loading message if not mounted
  if (!isMounted ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <MainPage />;
}
