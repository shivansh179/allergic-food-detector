"use client";

import { useState, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import axios from 'axios';
import { auth, db } from '@/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, doc, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

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
  const [error, setError] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true); // State to control active input method (scanner or manual input)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Query the healthInfo collection where email matches the logged-in user’s email
        const healthInfoRef = collection(db, 'healthInfo');
        const q = query(healthInfoRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const data = docSnapshot.data();
          setUserAllergies(data.allergies ? data.allergies.split(',').map((a: string) => a.trim().toLowerCase()) : []);
        } else {
          setUserAllergies([]);
        }
      } else {
        setUser(null);
        setUserAllergies([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBarcodeDetected = async (barcode: string) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);

      if (response.data && response.data.product) {
        setProduct(response.data.product);
        setError('');

        if (user && userAllergies.length > 0) {
          const productIngredients = response.data.product.ingredients_text?.toLowerCase() || '';

          const foundAllergy = userAllergies.find(allergy => productIngredients.includes(allergy));
          if (foundAllergy) {
            setAllergyWarning(`Warning: This product contains an ingredient you're allergic to: ${foundAllergy}`);
          }
        }
      } else {
        setError('Product not found');
        setProduct(null);
      }
    } catch (err) {
      setError('Product not found or error fetching data.');
      setProduct(null);
    }
  };

  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim());
    }
  };

  const closeAllergyWarning = () => {
    setAllergyWarning(null);
  };

  // Toggle between scanner and manual barcode input
  const toggleScanner = () => {
    setIsScannerActive(true);
    setManualBarcode(''); // Reset manual barcode input when switching to scanner
  };

  const toggleManualInput = () => {
    setIsScannerActive(false);
    setManualBarcode(''); // Reset barcode when switching to manual input
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-black">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold text-center text-black mb-6">Scan or Enter a Product Barcode</h1>

          {/* Allergy Warning Modal */}
          {allergyWarning && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-red-600 text-white p-6 rounded-md shadow-lg max-w-sm w-full">
                <p className="font-bold text-lg">{allergyWarning}</p>
                <button
                  onClick={closeAllergyWarning}
                  className="mt-4 w-full bg-white text-red-600 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  Close Warning
                </button>
              </div>
            </div>
          )}

          {/* Buttons to toggle between scanner and manual input */}
          <div className="flex justify-center mb-6">
            {isScannerActive ? (
              <>
                <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md">
                  <BarcodeScanner onDetected={handleBarcodeDetected} />
                </div>
                <button
                  onClick={toggleManualInput}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Switch to Manual Barcode Input
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Enter barcode manually"
                    className="p-3 border border-gray-300 rounded-md w-full max-w-xs mb-3"
                  />
                  <button
                    onClick={handleManualBarcodeSubmit}
                    className="w-full max-w-xs bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit Barcode
                  </button>
                </div>
                <button
                  onClick={toggleScanner}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Switch to Camera Scanner
                </button>
              </>
            )}
          </div>

          {product ? (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{product.product_name || 'No name available'}</h2>
              <img
                src={product.image_url || '/default-image.png'}
                alt={product.product_name}
                className="w-32 h-32 object-contain mb-4 mx-auto"
              />
              <p><strong>Brand:</strong> {product.brands || 'No brands available'}</p>
              <p><strong>Categories:</strong> {product.categories || 'No categories available'}</p>
              <p><strong>Labels:</strong> {product.labels || 'No labels available'}</p>
              <p><strong>Nutrition Grade:</strong> {product.nutrition_grades || 'No nutrition grade available'}</p>
              <p><strong>Barcode:</strong> {product.code || 'No barcode available'}</p>

              <h3 className="font-medium mt-4">Ingredients:</h3>
              <p>{product.ingredients_text || 'Ingredients not available'}</p>
            </div>
          ) : error ? (
            <p className="text-red-500 mt-4 text-center">{error}</p>
          ) : (
            <p className="mt-4 text-center">Scan a barcode or enter it manually to see the product details</p>
          )}
        </div>
      </div>
    </>
  );
}
