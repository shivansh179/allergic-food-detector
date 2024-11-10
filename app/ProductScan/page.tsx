"use client";

import { useState, useEffect } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";
import axios from "axios";
import { auth, db } from "@/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";

type Product = {
  product_name: string | undefined;
  name: string;
  brands: string;
  ingredients_text: string;
  categories: string;
  labels: string;
  nutrition_grades: string;
  code: string;
  image_url: string;
};

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true);

 // New useEffect to monitor product updates
useEffect(() => {
  if (product && user && userAllergies.length > 0) {
    const productIngredients = product.ingredients_text?.toLowerCase() || "";
    const foundAllergy = userAllergies.find((allergy) => productIngredients.includes(allergy));
    if (foundAllergy) {
      setAllergyWarning(`Warning: This product contains an ingredient you're allergic to: ${foundAllergy}`);
    } else {
      setAllergyWarning(null); // Clear previous warnings if no allergens are found
    }
  }
}, [product, user, userAllergies]);

// handleBarcodeDetected remains the same
const handleBarcodeDetected = async (barcode: string) => {
  try {
    const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
    if (response.data && response.data.product) {
      setProduct(response.data.product);
      setError("");
    } else {
      setError("Product not found");
      setProduct(null);
    }
  } catch (err) {
    setError("Product not found or error fetching data.");
    setProduct(null);
  }
};


  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim());
    }
  };

  const closeAllergyWarning = () => setAllergyWarning(null);

  const toggleScanner = () => {
    setIsScannerActive(true);
    setManualBarcode("");
  };

  const toggleManualInput = () => {
    setIsScannerActive(false);
    setManualBarcode("");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 text-gray-800">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mt-12">
          <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Product Barcode Scanner</h1>

          {allergyWarning && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <p className="font-bold text-lg">{allergyWarning}</p>
                <button
                  onClick={closeAllergyWarning}
                  className="mt-4 w-full bg-white text-red-600 py-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                  Close Warning
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            {isScannerActive ? (
              <div className="w-full flex flex-col items-center">
                <BarcodeScanner onDetected={handleBarcodeDetected} />
                <button
                  onClick={toggleManualInput}
                  className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Use Manual Barcode Entry
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode"
                  className="p-3 border border-gray-300 rounded-lg w-full max-w-md mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleManualBarcodeSubmit}
                  className="w-full max-w-md bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
                <button
                  onClick={toggleScanner}
                  className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Use Camera Scanner
                </button>
              </div>
            )}
          </div>

          {product ? (
            <div className="mt-8 p-8 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">{product.product_name || "Unnamed Product"}</h2>
              <img
                src={product.image_url || "/default-image.png"}
                alt={product.product_name}
                className="w-48 h-48 object-cover rounded-lg mx-auto mb-6"
              />
              <p className="text-lg text-gray-600"><strong>Brand:</strong> {product.brands || "N/A"}</p>
              <p className="text-lg text-gray-600"><strong>Categories:</strong> {product.categories || "N/A"}</p>
              <p className="text-lg text-gray-600"><strong>Labels:</strong> {product.labels || "N/A"}</p>
              <p className="text-lg text-gray-600"><strong>Nutrition Grade:</strong> {product.nutrition_grades || "N/A"}</p>
              <p className="text-lg text-gray-600"><strong>Barcode:</strong> {product.code || "N/A"}</p>
              <h3 className="text-lg font-semibold text-gray-600 mt-6">Ingredients</h3>
              <p className="text-gray-600">{product.ingredients_text || "Not available"}</p>
            </div>
          ) : error ? (
            <p className="text-red-500 mt-8 text-center">{error}</p>
          ) : (
            <p className="mt-8 text-center text-gray-500">Scan or enter a barcode to view product details</p>
          )}
        </div>
      </div>
    </>
  );
}
