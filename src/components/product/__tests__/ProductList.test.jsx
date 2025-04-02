import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from '../ProductList';
import productReducer, { fetchProducts } from '../../../features/product/productSlice';

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
    const errorMessage = 'Failed to fetch';
    console.log('Starting error state test');
    
    // Mock fetch to reject with an error for both the total items and products fetch
    global.fetch
      .mockRejectedValueOnce(new Error(errorMessage))  // For total items
      .mockRejectedValueOnce(new Error(errorMessage)); // For products

    // Create store with initial state
    const store = createMockStore({
      items: [],
      status: 'idle',
      error: null,
      currentPage: 1,
    });

    console.log('Initial store state:', store.getState().products);

    // Render the component
    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    console.log('Component rendered, waiting for error message...');

    // Wait for the error message to be rendered
    const errorElement = await screen.findByTestId('error-message', { timeout: 3000 });
    console.log('Found error element:', errorElement?.textContent);

    // Verify the error state
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(`Error: ${errorMessage}`);

    // Verify the Redux state
    const finalState = store.getState().products;
    console.log('Final Redux state:', finalState);
    expect(finalState.status).toBe('failed');
    expect(finalState.error).toBe(errorMessage);
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
      
      // Check the product details in the modal
      const modalContent = modalContainer.querySelector('.bg-white');
      expect(modalContent).toHaveTextContent('Test Product 1');
      expect(modalContent).toHaveTextContent('Test Description 1');
      expect(modalContent).toHaveTextContent('Test Category');
      expect(modalContent).toHaveTextContent('Test Brand');
      expect(modalContent).toHaveTextContent('$99.99');
      expect(modalContent).toHaveTextContent('4.5/5');
      expect(modalContent).toHaveTextContent('10 units');
      expect(modalContent).toHaveTextContent('Available');
    }, { timeout: 3000 });
  });
}); 