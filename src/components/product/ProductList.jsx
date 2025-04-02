import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, setCurrentPage, addProduct, updateProduct } from '../../features/product/productSlice';
import ProductForm from './ProductForm';
import ProductView from './ProductView';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, status, error, currentPage } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [totalItems, setTotalItems] = useState(0);

  // Add debug logs for state changes
  console.log('ProductList render:', { status, error, itemsLength: items.length });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching total items...');
        const response = await fetch('http://localhost:3000/products');
        const data = await response.json();
        setTotalItems(data.length);
      } catch (error) {
        console.error('Error fetching total items:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Fetching products for page:', currentPage);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    dispatch(fetchProducts({ start, end }));
  }, [dispatch, currentPage]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (productId) => {
    const productToDelete = items.find(p => p.id === productId);
    if (productToDelete) {
      setSelectedProduct(productToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct.id));
      
      // Update total items count
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setTotalItems(data.length);
      
      // Calculate new total pages
      const newTotalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
      
      // If we're on the last page and delete the last item, go to previous page
      if (currentPage > newTotalPages && newTotalPages > 0) {
        dispatch(setCurrentPage(newTotalPages));
      } else {
        // Refetch current page
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        dispatch(fetchProducts({ start, end }));
      }
      
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSubmit = async (formData) => {
    if (modalMode === 'add') {
      await dispatch(addProduct(formData));
      
      // Update total items count
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setTotalItems(data.length);
      
      // Calculate new total pages
      const newTotalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
      
      // If the new product would be on a new page, move to that page
      if (newTotalPages > totalPages) {
        dispatch(setCurrentPage(newTotalPages));
      } else {
        // Refetch current page
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        dispatch(fetchProducts({ start, end }));
      }
    } else if (modalMode === 'edit') {
      await dispatch(updateProduct({ id: selectedProduct.id, product: formData }));
      
      // Refetch current page after edit
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      dispatch(fetchProducts({ start, end }));
    }
    
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  if (status === 'loading') {
    console.log('Rendering loading state');
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    console.log('Rendering error state:', error);
    return <div className="text-center text-red-500" data-testid="error-message">Error: {error}</div>;
  }

  console.log('Rendering product list');
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={handleAddProduct}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-indigo-600">${product.price}</span>
              <span className="text-sm text-gray-500">Rating: {product.rating}/5</span>
            </div>
            <button
              onClick={() => handleViewProduct(product)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              data-testid={`view-details-${product.id}`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        title={modalMode === 'add' ? 'Add New Product' : modalMode === 'edit' ? 'Edit Product' : 'Product Details'}
      >
        {modalMode === 'view' && selectedProduct ? (
          <ProductView
            product={selectedProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        ) : (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            mode={modalMode}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProductList; 