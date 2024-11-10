"use client"

// pages/index.tsx
import { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import axios from 'axios';

type Product = {
  name: string;
  ingredients: string[];
};

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  const handleBarcodeDetected = async (barcode: string) => {
    try {
      const response = await axios.get(`/api/getProductInfo?barcode=${barcode}`);
      setProduct(response.data);
      setError('');
    } catch (err) {
      setError('Product not found or error fetching data.');
      setProduct(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Scan a Product</h1>
      <BarcodeScanner onDetected={handleBarcodeDetected} />

      {product ? (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <h3 className="font-medium">Ingredients:</h3>
          <ul className="list-disc ml-6">
            {product.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <p className="mt-4">Scan a barcode to see the product details</p>
      )}
    </div>
  );
}
