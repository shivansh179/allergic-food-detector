"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/Firebase'; // Import Firebase auth
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility

  useEffect(() => {
    // Set up a listener to check if the user is logged in or not
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // If user is logged in, set user state; otherwise, set it to null
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      setUser(null); // Update the user state to null
      setDropdownOpen(false); // Close the dropdown after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png" // Make sure to add your logo image to the public folder
            alt="Logo"
            className="h-8"
          />
          <h1 className="text-xl font-semibold">Food Safety</h1>
        </div>

        {/* Right: Navigation Buttons / User Info */}
        <div className="flex items-center space-x-6">
          <Link href="/" passHref>
            <button className="hover:text-green-400">Home</button>
          </Link>
          <Link href="/ProductScan" passHref>
            <button className="hover:text-green-400">Scan</button>
          </Link>
          <Link href="/contact" passHref>
            <button className="hover:text-green-400">Contact</button>
          </Link>
          <Link href="/learn-more" passHref>
            <button className="hover:text-green-400">Learn More</button>
          </Link>

          {/* Conditional Rendering based on User Authentication */}
          {!user ? (
            <Link href="/Auth" passHref>
              <button className="hover:text-green-400">Login</button>
            </Link>
          ) : (
            <div className="relative flex items-center space-x-4">
              {/* Profile image and email */}
              <img
                src={user.photoURL || '/user.png'} // Fallback to a default avatar if no photo
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={toggleDropdown} // Toggle dropdown on click
              />
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold">{user.email}</p>
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={handleSignOut}
                      className="text-sm text-red-500 hover:text-red-600 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
