import React from 'react';
import PropTypes from 'prop-types';

const ProductView = ({ product, onEdit, onDelete, onClose }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Category</h3>
          <p className="mt-1 text-sm text-gray-900">{product.category}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Brand</h3>
          <p className="mt-1 text-sm text-gray-900">{product.brand}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Price</h3>
          <p className="mt-1 text-sm text-gray-900">${product.price}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Rating</h3>
          <p className="mt-1 text-sm text-gray-900">{product.rating}/5</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Stock</h3>
          <p className="mt-1 text-sm text-gray-900">{product.stock} units</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="mt-1 text-sm text-gray-900">
            <span className={product.isAvailable ? 'text-green-600' : 'text-red-600'}>
              {product.isAvailable ? 'Available' : 'Out of Stock'}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => onEdit(product)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

ProductView.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    brand: PropTypes.string.isRequired,
    isAvailable: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductView; 