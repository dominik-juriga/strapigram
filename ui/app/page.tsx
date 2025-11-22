import { getJwtFromCookies } from "./utils";
import Link from "next/link";

export default async function Home() {
  const jwt = await getJwtFromCookies();
  const isAuthenticated = !!jwt;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-[600px] flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1
            className="text-7xl font-semibold"
            style={{ fontFamily: "cursive" }}
          >
            Strapigram
          </h1>
        </div>

        {/* Hero Text */}
        <div className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Share Your World Through Photos
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Connect with friends and explore the world through beautiful images.
            Strapigram is a modern social network built for sharing moments that
            matter.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-4">
            <div className="text-4xl mb-2">📸</div>
            <h3 className="font-semibold text-gray-900 mb-1">Share Photos</h3>
            <p className="text-sm text-gray-600">
              Upload and share your favorite moments with the community
            </p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-2">❤️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Like & Engage</h3>
            <p className="text-sm text-gray-600">
              Show appreciation for posts you love and connect with others
            </p>
          </div>
        </div>

        {/* CTA Button */}
        {isAuthenticated ? (
          <Link
            href="/feed"
            className="w-full max-w-[300px] py-3 bg-blue-500 text-white text-base font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Feed
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="w-full max-w-[300px] py-3 bg-blue-500 text-white text-base font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In to Get Started
          </Link>
        )}

        {/* Footer */}
        <div className="mt-16 text-sm text-gray-500">
          <p>Built with Strapi & Next.js</p>
        </div>
      </div>
    </div>
  );
}
