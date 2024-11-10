"use client"

import { useState } from "react";
import { db } from "@/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HealthForm() {
  const [email, setEmail] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !allergies || !medicalConditions) {
      toast.error("Please fill all the details");
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      // Save data to Firebase Firestore
      const docRef = await addDoc(collection(db, "healthInfo"), {
        email,
        allergies,
        medicalConditions,
        createdAt: new Date(),
      });
      // Redirect user after successful submission
      toast.success("Thank you for your response")
      router.push("/");  // You can create a thank-you page
    } catch (e) {
      toast.error("Problem in submitting check all the fields")
      console.error("Error adding document: ", e);
      setError("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-black mb-8">
          Health Information Form
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-black">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 mt-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Allergies Textarea */}
          <div>
            <label htmlFor="allergies" className="block text-lg font-medium text-black">
              Allergies
            </label>
            <textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              required
              className="w-full p-4 mt-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List any allergies you have"
              rows={4}
            ></textarea>
          </div>

          {/* Medical Conditions Textarea */}
          <div>
            <label htmlFor="medicalConditions" className="block text-lg font-medium text-black">
              Medical Conditions
            </label>
            <textarea
              id="medicalConditions"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              required
              className="w-full p-4 mt-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List any medical conditions you have"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 px-8 rounded-md w-full`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500">
          <p className="text-sm">Your information is private and secure.</p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
