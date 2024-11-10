"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/Firebase"; // Import Firebase Authentication and Firestore
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [user, setUser] = useState<any>(null); // Store the current logged-in user
  const [isEmailRegistered, setIsEmailRegistered] = useState(false); // Check if email exists in healthInfo collection
  const [showDialog, setShowDialog] = useState(false); // To control dialog visibility
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Set the current logged-in user
        const userEmail = user.email;

        // Query the healthInfo collection to check if email exists
        const q = query(collection(db, "healthInfo"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsEmailRegistered(true); // Email is registered in healthInfo collection
          setShowDialog(true); // Show the dialog
          router.push("/"); // Redirect to home page
        } else {
          setIsEmailRegistered(false); // Email not found in healthInfo collection
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up on component unmount
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/UserProfile");
    } catch (err) {
      setError("Error logging in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/UserProfile");
    } catch (err) {
      setError("Error registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          {isRegistering ? "Create an Account" : "Login"}
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (isRegistering ? "Registering..." : "Logging in...") : (isRegistering ? "Create Account" : "Login")}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-black">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Register here
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h2 className="text-xl font-semibold text-center text-black mb-4">Scan Product</h2>
            <p className="text-center text-black mb-4">
              Your health information is updated. Click below to scan a product and check if it's suitable for you.
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeDialog}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
