# ReactJS Training Test - Practical 01 | Product Management App

A ReactJS application for managing products with features like viewing, adding, editing, and deleting products. Built with React, Redux Toolkit, and Tailwind CSS.

## Features

- View list of products with pagination (5 items per page)
- Add new products
- Edit existing products
- Delete products with confirmation
- Responsive design
- Detailed product view
- Form validation
- State management with Redux Toolkit

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/buland-growexxer/ReactJS---Practical-Task-01.git
cd product-app
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the JSON Server (in a separate terminal):

```bash
json-server --watch db.json --port 3000
```

2. Start the React development server (in another terminal):

```bash
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:5173
```

## Project Structure

```
product-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Modal.jsx
│   │   │   └── ConfirmationModal.jsx
│   │   └── product/
│   │       ├── ProductForm.jsx
│   │       ├── ProductList.jsx
│   │       └── ProductView.jsx
│   ├── features/
│   │   └── product/
│   │       └── productSlice.js
│   ├── App.jsx
│   └── main.jsx
├── db.json
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally

## API Endpoints

The application uses JSON Server with the following endpoints:

- `GET /products` - Get all products
- `GET /products/:id` - Get a single product
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## Usage

Home Page opens up with a product list of all products.

New products acan be added by clicking the "Add Product" button on the top right corner. Clicking it opens up a form wherein necessary details need to be provided accordingly.

In the product list, each item displays the product title and description alongwith the price and rating. To view additional information, click on the "View Details" button.

Clicking on "View Details" also opens up the features for editing and deleting the product.
