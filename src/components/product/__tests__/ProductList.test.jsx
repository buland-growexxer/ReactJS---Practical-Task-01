import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from '../ProductList';
import productReducer from '../../../features/product/productSlice';

// Mock the fetch function
global.fetch = vi.fn();

// Create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      products: productReducer,
    },
    preloadedState: {
      products: initialState,
    },
  });
};

describe('ProductList Component', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Test Product 1',
      description: 'Test Description 1',
      category: 'Test Category',
      price: 99.99,
      rating: 4.5,
      stock: 10,
      brand: 'Test Brand',
      isAvailable: true,
      createdAt: '2024-05-23T08:56:21.618Z',
      updatedAt: '2024-05-23T08:56:21.618Z',
    },
    {
      id: 2,
      title: 'Test Product 2',
      description: 'Test Description 2',
      category: 'Test Category',
      price: 149.99,
      rating: 4.8,
      stock: 15,
      brand: 'Test Brand',
      isAvailable: true,
      createdAt: '2024-05-23T08:56:21.619Z',
      updatedAt: '2024-05-23T08:56:21.619Z',
    },
  ];

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockReset();
    // Mock the fetch response for total items
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProducts),
      })
    );
  });

  it('renders product list correctly', async () => {
    const store = createMockStore({
      items: mockProducts,
      status: 'succeeded',
      error: null,
      currentPage: 1,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Wait for products to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$149.99')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows loading state', async () => {
    const store = createMockStore({
      items: [],
      status: 'loading',
      error: null,
      currentPage: 1,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows error state', async () => {
    const errorMessage = 'Failed to fetch products';
    const store = createMockStore({
      items: [],
      status: 'failed',
      error: errorMessage,
      currentPage: 1,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Wait for error message to be rendered
    await waitFor(() => {
      // Look for error message in a more flexible way
      const errorElement = screen.getByText((content) => 
        content.includes('Error') && content.includes(errorMessage)
      );
      expect(errorElement).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('opens add product modal when clicking add button', async () => {
    const store = createMockStore({
      items: mockProducts,
      status: 'succeeded',
      error: null,
      currentPage: 1,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument();
    }, { timeout: 3000 });

    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);

    // Wait for modal to be rendered
    await waitFor(() => {
      expect(screen.getByText('Add New Product')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('opens product details when clicking view details', async () => {
    const store = createMockStore({
      items: mockProducts,
      status: 'succeeded',
      error: null,
      currentPage: 1,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Find and click the View Details button for Test Product 1
    const viewDetailsButton = screen.getByTestId('view-details-1');
    fireEvent.click(viewDetailsButton);

    // Wait for modal to be rendered and check its contents
    await waitFor(() => {
      // Check if the modal is visible by looking for the modal container
      const modalContainer = screen.getByText('Product Details').closest('div[class*="fixed"]');
      expect(modalContainer).toBeInTheDocument();
      
      // Check the modal title
      expect(screen.getByText('Product Details')).toBeInTheDocument();
      
      // Check the product details
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('Test Brand')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('4.5/5')).toBeInTheDocument();
      expect(screen.getByText('10 units')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
}); 