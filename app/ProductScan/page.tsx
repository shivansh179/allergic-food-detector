"use client";

import { useState, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import axios from 'axios';
import { auth, db } from '@/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
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
  const [foundAllergy, setFoundAllergy] = useState<string | null>(null); // New state for allergy warning
  const [showCamera, setShowCamera] = useState(false); // New state to toggle between manual input and camera
  const [signal, setSignal] = useState(false);

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

          if (Array.isArray(data.allergies)) {
            setUserAllergies(data.allergies.map((a: string) => a.trim().toLowerCase()));
          } else {
            setUserAllergies([]);
          }
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

          // Check each allergy term to see if it's included in the ingredients text
          const foundAllergies = userAllergies.filter(allergy =>
            productIngredients.includes(allergy.toLowerCase())
          );

          if (foundAllergies.length > 0) {
            setSignal(true);
            setFoundAllergy(foundAllergies.join(', ')); // Show matched allergies
          } else {
            setFoundAllergy(null); // No allergies found
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

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-black">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold text-center text-black mb-6">Scan or Enter a Product Barcode</h1>

          {/* Toggle Buttons for Camera and Manual Input */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowCamera(true)}
              className={`w-full max-w-xs py-3 rounded-md ${showCamera ? 'bg-gray-300' : 'bg-blue-500 text-white'} mr-4`}
            >
              Scan with Camera
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className={`w-full max-w-xs py-3 rounded-md ${!showCamera ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
            >
              Enter Manually
            </button>
          </div>

          {/* Barcode Scanner or Manual Input */}
          {showCamera ? (
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md">
                <BarcodeScanner onDetected={handleBarcodeDetected} />
              </div>
            </div>
          ) : (
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
          )}

         {product ? (
  <div className="mt-4 p-6 bg-white rounded-lg shadow-md relative">
    {/* Red or Green Signal for Allergy or Health Status */}
    <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full">
      {signal ? (
        <span className="text-white text-3xl font-bold bg-red-600 w-10 h-10 flex items-center justify-center rounded-full">
          ! - Not Healthy
        </span>
      ) : (
        <span className="text-white text-3xl font-bold bg-green-600 w-10 h-10 flex items-center justify-center rounded-full">
          ✓ 
        </span>
                    
      )}
    </div>

    {/* Product Details */}
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


          {/* Allergy Warning Modal */}
          {foundAllergy && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Allergy Alert</h2>
                <p>
                  Warning: This product contains an ingredient you're allergic to: <strong>{foundAllergy}</strong>
                </p>
                <button
                  onClick={() => setFoundAllergy(null)}
                  className="mt-4 bg-white text-red-500 py-2 px-4 rounded hover:bg-gray-100 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
