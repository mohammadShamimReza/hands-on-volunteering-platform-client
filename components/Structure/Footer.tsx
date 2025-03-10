"use client";

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 px-6  bottom-0 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Cities Section */}
        <div>
          <h3 className="font-semibold mb-3">Cities</h3>
          <ul className="space-y-1 text-sm">
            {[
              "Atlanta",
              "Austin",
              "Boston",
              "Chicago",
              "Denver",
              "Las Vegas",
              "Los Angeles",
              "Miami",
              "Milwaukee",
              "New York",
              "Phoenix",
              "San Diego",
              "San Francisco",
            ].map((city) => (
              <li key={city}>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400"
                >
                  {city}
                </Link>
              </li>
            ))}
            <li className="font-semibold">
              <Link
                href="#"
                className="hover:text-blue-500 dark:hover:text-blue-400"
              >
                More Cities
              </Link>
            </li>
          </ul>
        </div>

        {/* Top Causes Section */}
        <div>
          <h3 className="font-semibold mb-3">Top Causes</h3>
          <ul className="space-y-1 text-sm">
            {[
              "Community",
              "Children & Youth",
              "Seniors",
              "Health & Medicine",
              "Education & Literacy",
              "Advocacy & Human Rights",
              "People with Disabilities",
              "Arts & Culture",
              "Animals",
              "Environment",
              "Hunger",
              "Veterans & Military Families",
              "Women",
              "Homeless & Housing",
            ].map((cause) => (
              <li key={cause}>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400"
                >
                  {cause}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-1 text-sm">
            {[
              "About",
              "Careers",
              "Team",
              "Press",
              "Technology Partners",
              "Live Map",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-1 text-sm">
            {[
              "Help",
              "Nonprofit Learning Center",
              "Webinars",
              "Blog - Engaging Volunteers",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business Solutions */}
        <div>
          <h3 className="font-semibold mb-3">Business Solutions</h3>
          <ul className="space-y-1 text-sm">
            {["Business Solutions", "Blog - Volunteering is CSR"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Social & Copyright Section */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-300 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          &copy; 1998-2025 VolunteerMatch. A 501(C)(3) Organization. EIN:
          77-0395654. All Rights Reserved.
          <Link
            href="#"
            className="underline hover:text-blue-500 dark:hover:text-blue-400"
          >
            Privacy Policy
          </Link>{" "}
          /
          <Link
            href="#"
            className="underline hover:text-blue-500 dark:hover:text-blue-400"
          >
            Terms of Use
          </Link>
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#">
            <Facebook className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400" />
          </Link>
          <Link href="#">
            <Twitter className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400" />
          </Link>
          <Link href="#">
            <Youtube className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400" />
          </Link>
          <Link href="#">
            <Linkedin className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400" />
          </Link>
          <Link href="#">
            <Instagram className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
