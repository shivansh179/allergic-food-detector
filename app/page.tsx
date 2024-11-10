// pages/index.tsx
"use client"

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    // Show dialog when the page loads
    setShowDialog(true);
  }, []);

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Navbar/>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl text-black font-bold mb-4">Welcome!</h2>
            <p className="text-lg mb-4 text-black">
              Scan a product to get its ingredients, or login to see if it's suitable for you based on your allergies.
            </p>
            <button
              onClick={closeDialog}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white text-black font-sans">
        {/* Header Section */}
        <header className="bg-green-600 text-white text-center py-16">
          <h1 className="text-4xl font-bold">Food Safety: Protect Your Health</h1>
          <p className="mt-4 text-lg">Learn why food safety matters and how to keep your food safe from contamination.</p>
        </header>

        {/* Importance of Food Safety */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-8">Why Food Safety Matters</h2>
            <p className="text-lg mb-6">
              Foodborne illnesses affect millions of people every year. Proper food safety practices reduce the risk of contamination, ensuring that the food you consume is safe and healthy. By following basic food safety principles, you can protect yourself and your loved ones from harmful bacteria, viruses, and toxins.
            </p>
            <p className="text-lg mb-6">
              From proper handling to safe storage and cooking, understanding the steps to prevent foodborne illnesses is crucial for maintaining good health and well-being.
            </p>
            <img src="/7130865.jpg" alt="Food Safety" className="w-full h-auto max-w-md mx-auto rounded-lg shadow-lg" />
          </div>
        </section>

        {/* Food Safety Tips Section */}
        <section className="bg-gray-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-8">Food Safety Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">1. Keep Your Hands Clean</h3>
                <p className="text-lg">
                  Wash your hands with soap and water before handling food, after handling raw meat, and after using the restroom.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">2. Separate Raw and Cooked Foods</h3>
                <p className="text-lg">
                  Use separate cutting boards for raw meats and ready-to-eat foods to avoid cross-contamination.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">3. Cook Food to the Right Temperature</h3>
                <p className="text-lg">
                  Ensure that meat and poultry are cooked to the proper internal temperature to kill harmful bacteria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-green-600 text-white text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Take Action for Food Safety</h2>
            <p className="text-lg mb-8">
              By following the basic steps of food safety, you can help prevent illness and protect yourself and your family.
            </p>
            <Link href="/learn-more" passHref>
              <div className="bg-white text-green-600 px-6 py-3 text-lg font-semibold rounded-full hover:bg-gray-100 transition">
                Learn More About Food Safety
              </div>
            </Link>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg">© 2024 Food Safety Awareness. All Rights Reserved.</p>
            <div className="mt-4 flex justify-center">
              <Link href="/privacy-policy" passHref>
                <div className="text-sm text-white hover:text-gray-400 mx-4">Privacy Policy</div>
              </Link>
              <Link href="/terms-of-service" passHref>
                <div className="text-sm text-white hover:text-gray-400 mx-4">Terms of Service</div>
              </Link>
            </div>
          </div>
        </footer>
      </div>
              <ToastContainer />

    </>
  );
}
