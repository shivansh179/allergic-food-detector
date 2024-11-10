// pages/api/getProductInfo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barcode } = req.query;

  try {
    // Fetch product details from Open Food Facts API
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

    // Check if product exists in the database
    if (response.data.status === 1) {
      const product = response.data.product;
      const productInfo = {
        name: product.product_name,
        ingredients: product.ingredients_text ? product.ingredients_text.split(',') : ['No ingredients info available'],
      };
      res.status(200).json(productInfo);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product information' });
  }
}
