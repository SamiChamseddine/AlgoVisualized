import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const images = [
  {
    type: "sort",
    link: "/icon/sortVisualizer.webp",
    description:
      "Visualize how different sorting algorithms work in real-time. " +
      "Understand the inner workings of algorithms like Bubble Sort, Merge Sort, " +
      "Quick Sort, and more with interactive animations.",
    title: "Sort Visualizer",
  },
  {
    type: "fit",
    link: "/icon/curveVisualizer.webp",
    description:
      "Visualize fitting how curve fitting works. " +
      "Examine algorithms like linear regression, polynomial fitting, " +
      "and other curve approximation methods.",
    title: "Fit Visualizer",
  },
];

const MainPage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-gray-200">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center border rounded-md border-black h-screen w-4/5 pt-  bg-gradient-to-r from-blue-900 to-gray-900 overflow-hidden">
        {/* Slideshow Container */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.link}
                alt={`Background ${index}`}
                className="w-full h-full object-cover"
                style={{
                  maskImage:
                    "linear-gradient(to left, transparent 0%, gray 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to left, transparent 0%, gray 100%)",
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="text-center">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
                currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-gray-500 text-transparent bg-clip-text">
                {image.title}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mb-8 px-4">
                {image.description}
              </p>
              <Link
                to="/visualizer"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-gray-500 text-transparent bg-clip-text">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">
                Interactive Visualizations
              </h3>
              <p className="text-gray-300">
                Watch sorting algorithms in action with real-time animations and
                step-by-step explanations.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">
                Multiple Algorithms
              </h3>
              <p className="text-gray-300">
                Explore a variety of sorting algorithms, including Bubble Sort,
                Merge Sort, Quick Sort, and more.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">
                Customizable Settings
              </h3>
              <p className="text-gray-300">
                Adjust array size, sorting speed, and choose different
                algorithms to see how they perform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} AlgoVisualized. All rights
            reserved.
          </p>
          <p className="text-gray-400 mt-2">By Sami Chamseddine</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
