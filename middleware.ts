import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;



  if (!currentUser) {
    if (
      pathname.startsWith("/profile") ||
      pathname.startsWith("/events/manage") ||
      pathname.startsWith("/teams/manage") ||
      pathname.startsWith("/teams/") ||
      pathname.startsWith("/helpPost/manage")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next(); // Allow access to other routes
  }

  // Handle authenticated user access
  if (currentUser) {
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    if (pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    
    return NextResponse.next(); // Allow access to other routes
  }

  // Default response
  return NextResponse.next();
}
``;