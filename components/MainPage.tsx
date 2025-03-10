"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section
        className=" w-full h-[80vh] flex flex-col justify-center items-center text-black text-center bg-cover bg-center "
        style={{ backgroundImage: "url('/hero-image.webp')"}}
      >
        <div className="bg-opacity-50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-5xl font-bold mb-4">
            Find Meaningful Volunteer Opportunities
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Transform communities through the power of volunteering. Connect,
            contribute, and create impact today!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary">
              <Link href="/events">Find Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Volunteering Categories Section */}
      <section className="py-16 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          Discover Volunteering Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            "Education",
            "Health",
            "Community",
            "Children & Youth",
            "Environment",
            "Arts & Culture",
          ].map((category) => (
            <div
              key={category}
              className="p-4 border rounded-lg shadow text-center"
            >
              <p className="font-semibold">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="py-16 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          Featured Volunteer Opportunities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>Community Cleanup Drive</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Join our efforts in cleaning up local parks and streets to
                    promote a cleaner environment.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/events">See Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="w-full py-16 border-dotted border-2 rounded-2xl  text-center">
        <h2 className="text-3xl font-bold mb-6">Making a Difference</h2>
        <p className="mb-6">
          See how our volunteers are changing lives every day.
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-lg font-semibold">
          <p>
            <span className="text-red-500 text-4xl">750K</span> Monthly Visitors
          </p>
          <p>
            <span className="text-green-500 text-4xl">19.3M</span> Volunteers
            Connected
          </p>
          <p>
            <span className="text-blue-500 text-4xl">151.8K</span> Nonprofits
            Supported
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">What Volunteers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border-dashed border-2 rounded-lg shadow">
            <p className="italic">
              "Volunteering has changed my life! I’ve made so many connections
              and helped causes I deeply care about."
            </p>
            <p className="mt-4 font-semibold">- Sarah, Community Volunteer</p>
          </div>
          <div className="p-6 border-dashed border-2 rounded-lg shadow">
            <p className="italic">
              "HandsOn gave me the opportunity to contribute to meaningful
              projects and make a real impact!"
            </p>
            <p className="mt-4 font-semibold">- Mark, Team Leader</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-16 text-center bg-gradient-to-r rounded-2xl mb-5 from-indigo-500 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Join Hands to Make a Difference
        </h2>
        <p className="mb-6">
          Sign up today and start making an impact in your community.
        </p>
        <Button asChild variant="secondary">
          <Link href="/signup">Get Started</Link>
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
