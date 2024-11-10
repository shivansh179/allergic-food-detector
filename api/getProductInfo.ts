import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Product = {
  name: string;
  brands: string;
  ingredients: string[];
  categories: string;
  labels: string;
  nutrition_grades: string;
  barcode: string;
  image_url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barcode } = req.query;

  try {
    // Fetch product details from Open Food Facts API
    const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
    console.log(response);
    
    if (response.data.status === 1) {
      const productData = response.data.product;

      const product: Product = {
        name: productData.product_name || 'No name available',
        brands: productData.brands || 'No brands available',
        ingredients: productData.ingredients_text
          ? productData.ingredients_text.split(', ')
          : ['Ingredients not available'],
        categories: productData.categories || 'No categories available',
        labels: productData.labels || 'No labels available',
        nutrition_grades: productData.nutrition_grades || 'No nutrition grade available',
        barcode: productData.code || 'No barcode available',
        image_url: productData.image_url || '',
      };

      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product information:', error);
    res.status(500).json({ error: 'Error fetching product information' });
  }
}
