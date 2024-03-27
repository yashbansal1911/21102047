const express = require('express');
const app = express();

// Array to store the product data
const products = [
  {
    "productName": "Laptop 1",
    "companyName": "AMZ",
    "categoryName": "Laptop",
    "price": 2236,
    "rating": 4.7,
    "discount": 63,
    "availability": "yes"
  },
  {
    "productName": "Laptop 13",
    "companyName": "AMZ",
    "categoryName": "Laptop",
    "price": 1244,
    "rating": 4.5,
    "discount": 45,
    "availability": "out-of-stock"
  },
  {
    "productName": "Laptop 3",
    "companyName": "AMZ",
    "categoryName": "Laptop",
    "price": 9102,
    "rating": 4.44,
    "discount": 98,
  },
  // ... remaining product data with companyName and categoryName properties
];

// API endpoint to get top n products for a particular company and category within a price range
app.get('/test/companies/:companyname/categories/:categoryname/products', (req, res) => {
  const { companyname, categoryname } = req.params;
  const { top, minPrice, maxPrice } = req.query;

  // Check if the company name is valid
  const validCompanies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
  if (!validCompanies.includes(companyname)) {
    return res.status(400).json({ error: 'Invalid company name' });
  }

  // Check if the category name is valid
  const validCategories = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad", "Bluetooth", "Pendrive", "Remote", "Speaker", "Headset", "Laptop", "PC"];
  if (!validCategories.includes(categoryname)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }

  // Filter products based on company, category, and price range
  const filteredProducts = products.filter(product =>
    product.companyName === companyname &&
    product.categoryName === categoryname &&
    product.price >= minPrice &&
    product.price <= maxPrice
  );

  // Sort products by rating in descending order
  const sortedProducts = filteredProducts.sort((a, b) => b.rating - a.rating);

  // Get the top n products
  const topProducts = sortedProducts.slice(0, top);

  // Remove companyName and categoryName from the response
  const responseProducts = topProducts.map(product => {
    const { companyName, categoryName, ...rest } = product;
    return rest;
  });

  res.json(responseProducts);
});