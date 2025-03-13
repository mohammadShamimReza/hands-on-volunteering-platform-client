"use client";

import { Button } from "@/components/ui/button";
import { getTokenFromCookie, removeTokenFromCookies } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeAuthToken, storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";


const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const tokenFromLocalStorage = useMemo(() => {
    // Only access localStorage if running in the browser
    if (typeof window !== "undefined") {
      return getTokenFromCookie();
    }
    return null;
  }, []);

  const { data: userData, isLoading } = useGetUserInfoQuery({ undefined });

  useEffect(() => {
    if (userData) {
      dispatch(storeUserInfo(userData?.data));
    }
  }, [userData, dispatch]);
  
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const authTokenFromRedux = useAppSelector((state) => state.auth.authToken);


  const removeTokenCookies = useCallback(() => {
    return removeTokenFromCookies();
  }, []);
  // Store token in Redux if available
  useEffect(() => {
    if (tokenFromLocalStorage) {
      dispatch(storeAuthToken(tokenFromLocalStorage));
    }
  }, [tokenFromLocalStorage, dispatch]);

  // Store user data in Redux when available


  const authToken = getTokenFromCookie() || authTokenFromRedux;
  useEffect(() => {
    if (userData) {
      dispatch(storeUserInfo(userData.data)); // Set user in Redux if data is returned
    }

    if (!authToken) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }, [
    authToken,
    authTokenFromRedux,
    userData,
    dispatch,
    removeTokenFromCookies,
  ]);

  const handleSetActive = (name: string) => {
    setActive(name);
    setIsOpen(false); // Close mobile menu on selection
  };

  const handleLogout = () => {
    console.log('log out')
    removeTokenCookies();
    dispatch(removeAuthToken());

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  console.log(authenticated, "authenticated");

  return (
    <nav className="flex justify-between items-center w-full px-6  bg-white dark:bg-gray-900 shadow-md relative">
      {/* Left - Logo */}
      <div className="flex items-center gap-4 ">
        <Image
          src="/logo2.png"
          width={90}
          height={80}
          alt="Picture of the author"
        />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        <Button
          variant={active === "home" ? "default" : "outline"}
          onClick={() => handleSetActive("home")}
          asChild
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant={active === "events" ? "default" : "outline"}
          onClick={() => handleSetActive("events")}
          asChild
        >
          <Link href="/events">Events</Link>
        </Button>
        <Button
          variant={active === "requests" ? "default" : "outline"}
          onClick={() => handleSetActive("requests")}
          asChild
        >
          <Link href="/helpPost">Post</Link>
        </Button>
        <Button
          variant={active === "teams" ? "default" : "outline"}
          onClick={() => handleSetActive("teams")}
          asChild
        >
          <Link href="/teams">Teams</Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/volunteer">Volunteer Now</Link>
        </Button>
      </div>

      {/* Theme Toggle Button */}
      <div className="flex items-center gap-2">
        {!authenticated ? (
          <Link href={"/signup"}>Sing in</Link>
        ) : (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {" "}
                  {userData?.profileImage ? (
                    <Image
                      src={userData?.profileImage}
                      alt="Profile Picture"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>
                    <a
                      href={"/profile"}
                      className="text-center bg-black text-white rounded-lg p-2"
                    >
                      Profile
                    </a>{" "}
                    <Button onClick={handleLogout} className="cursor-pointer">
                      log out
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md focus:outline-none hover:cursor-pointer "
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col md:hidden p-4 space-y-2">
          <Button
            variant={active === "home" ? "default" : "outline"}
            onClick={() => handleSetActive("home")}
            asChild
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            variant={active === "events" ? "default" : "outline"}
            onClick={() => handleSetActive("events")}
            asChild
          >
            <Link href="/events">Events</Link>
          </Button>
          <Button
            variant={active === "requests" ? "default" : "outline"}
            onClick={() => handleSetActive("requests")}
            asChild
          >
            <Link href="/helpPost">Post</Link>
          </Button>
          <Button
            variant={active === "teams" ? "default" : "outline"}
            onClick={() => handleSetActive("teams")}
            asChild
          >
            <Link href="/teams">Teams</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/volunteer">Volunteer Now</Link>
          </Button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md focus:outline-none"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
