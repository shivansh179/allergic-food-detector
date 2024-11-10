// pages/api/getProductInfo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Product = {
  name: string;
  ingredients: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barcode } = req.query;

  try {
    // Fetch product details from Open Food Facts API
    const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
    
    if (response.data.status === 1) {
      const productData = response.data.product;
      const product: Product = {
        name: productData.product_name,
        ingredients: productData.ingredients
          ? productData.ingredients.map((ingredient: any) => ingredient.text)
          : ['Ingredients not available'],
      };
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product information' });
  }
}
