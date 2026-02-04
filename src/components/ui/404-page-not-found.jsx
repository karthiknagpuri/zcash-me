"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { cn } from "../../../lib/utils";

function NotFoundPage({ className, ...props }) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center bg-white",
        className
      )}
      {...props}
    >
      {/* Background GIF */}
      <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404 animation"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-[120px] sm:text-[180px] font-bold text-gray-900 leading-none">
          404
        </h1>

        <div className="mt-[-20px] sm:mt-[-40px]">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Look like you&apos;re lost
          </h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for is not available!
          </p>

          <Button
            onClick={() => router.push("/")}
            className="bg-[#F4B728] hover:bg-[#E5A820] text-black font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export { NotFoundPage };
