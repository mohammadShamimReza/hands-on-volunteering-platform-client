"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getTokenFromCookie, removeTokenFromCookies } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import {
  removeAuthToken,
  storeAuthToken,
  storeUserInfo,
} from "@/redux/slice/authSlice";
import { Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import usePathname
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const pathname = usePathname(); // ✅ Get the current path
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch User Data
  const { data: userData } = useGetUserInfoQuery({});

  // ✅ Handle Authentication State
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(storeAuthToken(token));
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      dispatch(storeUserInfo(userData?.data));
      setAuthenticated(true);
    }
  }, [userData, dispatch]);

  const handleLogout = () => {
    removeTokenFromCookies();
    dispatch(removeAuthToken());
    setAuthenticated(false);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <nav className="flex justify-between items-center w-full px-6 bg-white dark:bg-gray-900 shadow-md relative">
      {/* Left - Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" passHref>
          <Image src="/logo2.png" width={90} height={80} alt="Logo" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md">
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        {[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: "Post", path: "/helpPost" },
          { name: "Teams", path: "/teams" },
          { name: "Leaderboard", path: "/leaderboard" },
        ].map((link) => (
          <Button
            key={link.name}
            variant={pathname === link.path ? "default" : "outline"} // ✅ Auto-detect active button
            asChild
          >
            <Link href={link.path}>{link.name}</Link>
          </Button>
        ))}
      </div>

      {/* Right Side: Theme & Authentication */}
      <div className="flex items-center gap-4">
        {!authenticated ? (
          <Link href="/login" passHref>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Log in
            </Button>
          </Link>
        ) : (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {userData?.data.profileImage ? (
                    <Image
                      src={userData?.data.profileImage || "/default-avatar.png"}
                      alt="Profile"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col items-center space-y-2 p-2">
                    <Link href="/profile" passHref>
                      <Button className="w-full">Profile</Button>
                    </Link>
                    <Button onClick={handleLogout} className="w-full">
                      Log out
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md"
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
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col p-4 space-y-2 md:hidden">
          {[
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: "Post", path: "/helpPost" },
            { name: "Teams", path: "/teams" },
            { name: "Leaderboard", path: "/leaderboard" },
          ].map((link) => (
            <Button
              key={link.name}
              variant={pathname === link.path ? "default" : "outline"} // ✅ Auto-detect active button
              asChild
            >
              <Link href={link.path}>{link.name}</Link>
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
