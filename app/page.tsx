"use client"

import { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import axios from 'axios';

type Product = {
  product_name: string | undefined;
  name: string;
  brands: string;
  ingredients_text: string;
  categories: string;
  labels: string;
  nutrition_grades: string;
  code: string;  // Barcode
  image_url: string;
};

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');

  const handleBarcodeDetected = async (barcode: string) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
      
      // Make sure that product data is available
      if (response.data && response.data.product) {
        setProduct(response.data.product);
        setError('');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Scan or Enter a Product Barcode</h1>

      {/* Barcode Scanner Component */}
      <BarcodeScanner onDetected={handleBarcodeDetected} />

      {/* Manual Barcode Entry */}
      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          placeholder="Enter barcode manually"
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <button
          onClick={handleManualBarcodeSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Barcode
        </button>
      </div>

      {/* Display Product Information */}
      {product ? (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">{product.product_name || 'No name available'}</h2>
          <img
            src={product.image_url || '/default-image.png'}
            alt={product.product_name}
            className="w-32 h-32 object-contain mb-4"
          />
          <p><strong>Brand:</strong> {product.brands || 'No brands available'}</p>
          <p><strong>Categories:</strong> {product.categories || 'No categories available'}</p>
          <p><strong>Labels:</strong> {product.labels || 'No labels available'}</p>
          <p><strong>Nutrition Grade:</strong> {product.nutrition_grades || 'No nutrition grade available'}</p>
          <p><strong>Barcode:</strong> {product.code || 'No barcode available'}</p>

          <h3 className="font-medium mt-2">Ingredients:</h3>
          <p>{product.ingredients_text || 'Ingredients not available'}</p>
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <p className="mt-4">Scan a barcode or enter it manually to see the product details</p>
      )}
    </div>
  );
}
