"use client";

import MainPage from "@/components/MainPage";
import { LoadingSpinner } from "@/components/ui/loading";
import { useEffect, useState } from "react";

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
