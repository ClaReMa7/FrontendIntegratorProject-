import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7F4]">
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl mb-4">404 - Page Not Found</h1>
        <p className="text-2xl mb-4">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="text-xl text-blue-500 hover:underline">
          Go to Home
        </Link>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default NotFound;
