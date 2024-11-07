/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css'; // Import the CSS file for styling

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={`https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg`} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;*/

/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [productReviews, setProductReviews] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [shippingStatus, setShippingStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.description] = acc[product.description] || []).push(product);
    return acc;
  }, {});

  const handleAddToList = (item, list, setList) => {
    if (!list.some(existingItem => existingItem.id === item.id)) {
      setList(prev => [...prev, item]);
      alert(`${item.name} added to ${list === wishlist ? 'wishlist' : 'cart'}!`);
    }
  };

  const handleReviewSubmit = (productId, rating, reviewText) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { rating, reviewText }],
    }));
    alert('Review submitted!');
  };

  const handleBuyNow = () => {
    if (cart.length) {
      const orderDetails = cart.map(({ name, price }) => ({ name, price, status: 'Processing' }));
      setOrderHistory(prev => [...prev, ...orderDetails]);
      setCart([]);
      updateShippingStatus(orderDetails);
      alert('Items bought successfully!');
    } else {
      alert('Your cart is empty!');
    }
  };

  const updateShippingStatus = (orders) => {
    setShippingStatus(prev => ({
      ...prev,
      ...orders.reduce((acc, { name }) => ({ ...acc, [name]: 'Shipped' }), {}),
    }));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('You have logged out successfully!');
    navigate("/auth");
  };

  const calculateCartTotal = () => cart.reduce((total, product) => total + product.price, 0);

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {Object.entries(groupedProducts).map(([description, products]) => (
        <div key={description} className="category-section">
          <h2>{description}</h2>
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <img src="https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg" alt={product.name} className="product-image" />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <button className="add-to-cart-button" onClick={() => handleAddToList(product, cart, setCart)}>Add to Cart</button>
                <button className="wishlist-button" onClick={() => handleAddToList(product, wishlist, setWishlist)}>Add to Wishlist</button>
                <div className="review-section">
                  <h3>Reviews</h3>
                  <ul>
                    {(productReviews[product.id] || []).map((review, index) => (
                      <li key={index}><strong>Rating:</strong> {review.rating} / 5<br /><strong>Review:</strong> {review.reviewText}</li>
                    ))}
                  </ul>
                  <div className="review-form">
                    <input type="number" min="1" max="5" placeholder="Rating (1-5)" id={`rating-${product.id}`} />
                    <input type="text" placeholder="Write your review" id={`reviewText-${product.id}`} />
                    <button onClick={() => handleReviewSubmit(product.id, parseInt(document.getElementById(`rating-${product.id}`).value), document.getElementById(`reviewText-${product.id}`).value)}>Submit Review</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {wishlist.length > 0 && (
        <div className="wishlist-section">
          <h2>Your Wishlist</h2>
          <div className="wishlist-grid">
            {wishlist.map(item => (
              <div className="wishlist-card" key={item.id}>
                <img src="https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg" alt={item.name} className="product-image" />
                <h2 className="product-name">{item.name}</h2>
                <p className="product-description">{item.description}</p>
                <p className="product-price">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="cart-section">
          <h2>Shopping Cart</h2>
          <div className="cart-grid">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
          <h3>Total: ${calculateCartTotal()}</h3>
          <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
        </div>
      )}
      {orderHistory.length > 0 && (
        <div className="order-history-section">
          <h2>Order History</h2>
          <div className="order-history-grid">
            {orderHistory.map((item, index) => (
              <div className="order-card" key={index}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Status: {shippingStatus[item.name] || 'Processing'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;*/

/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [productReviews, setProductReviews] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [shippingStatus, setShippingStatus] = useState({});
  const navigate = useNavigate();

  // Mock product data
  const mockProducts = [
    { id: 1, name: 'Product 1', description: 'Category 1', price: 10 },
    { id: 2, name: 'Product 2', description: 'Category 1', price: 20 },
    { id: 3, name: 'Product 3', description: 'Category 2', price: 15 },
    // Add more products as needed
  ];

  useEffect(() => {
    // Set mock data instead of fetching from a server
    setProducts(mockProducts);
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.description] = acc[product.description] || []).push(product);
    return acc;
  }, {});

  const handleAddToList = (item, list, setList) => {
    if (!list.some(existingItem => existingItem.id === item.id)) {
      setList(prev => [...prev, item]);
      alert(`${item.name} added to ${list === wishlist ? 'wishlist' : 'cart'}!`);
    }
  };

  const handleReviewSubmit = (productId, rating, reviewText) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { rating, reviewText }],
    }));
    alert('Review submitted!');
  };

  const handleBuyNow = () => {
    if (cart.length) {
      const orderDetails = cart.map(({ name, price }) => ({ name, price, status: 'Processing' }));
      setOrderHistory(prev => [...prev, ...orderDetails]);
      setCart([]);
      updateShippingStatus(orderDetails);
      alert('Items bought successfully!');
    } else {
      alert('Your cart is empty!');
    }
  };

  const updateShippingStatus = (orders) => {
    setShippingStatus(prev => ({
      ...prev,
      ...orders.reduce((acc, { name }) => ({ ...acc, [name]: 'Shipped' }), {}),
    }));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('You have logged out successfully!');
    navigate("/auth");
  };

  const calculateCartTotal = () => cart.reduce((total, product) => total + product.price, 0);

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {Object.entries(groupedProducts).map(([description, products]) => (
        <div key={description} className="category-section">
          <h2>{description}</h2>
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <img src="https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg" alt={product.name} className="product-image" />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <button className="add-to-cart-button" onClick={() => handleAddToList(product, cart, setCart)}>Add to Cart</button>
                <button className="wishlist-button" onClick={() => handleAddToList(product, wishlist, setWishlist)}>Add to Wishlist</button>
                <div className="review-section">
                  <h3>Reviews</h3>
                  <ul>
                    {(productReviews[product.id] || []).map((review, index) => (
                      <li key={index}><strong>Rating:</strong> {review.rating} / 5<br /><strong>Review:</strong> {review.reviewText}</li>
                    ))}
                  </ul>
                  <div className="review-form">
                    <input type="number" min="1" max="5" placeholder="Rating (1-5)" id={`rating-${product.id}`} />
                    <input type="text" placeholder="Write your review" id={`reviewText-${product.id}`} />
                    <button onClick={() => handleReviewSubmit(product.id, parseInt(document.getElementById(`rating-${product.id}`).value), document.getElementById(`reviewText-${product.id}`).value)}>Submit Review</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default Products;*/

/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [productReviews, setProductReviews] = useState({});
  const navigate = useNavigate();

  // Mock product data
  const mockProducts = [
    { id: 1, name: 'Product 1', description: 'Category 1', price: 10 },
    { id: 2, name: 'Product 2', description: 'Category 1', price: 20 },
    { id: 3, name: 'Product 3', description: 'Category 2', price: 15 },
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  // Group products by description (category)
  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.description] = acc[product.description] || []).push(product);
    return acc;
  }, {});

  const handleAddToList = (item, list, setList, listName) => {
    if (!list.some(existingItem => existingItem.id === item.id)) {
      const updatedList = [...list, item];
      setList(updatedList);
      localStorage.setItem(listName, JSON.stringify(updatedList)); // Update localStorage
      alert(`${item.name} added to ${listName === 'wishlist' ? 'wishlist' : 'cart'}!`);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('You have logged out successfully!');
    navigate("/auth");
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button onClick={() => navigate('/wishlist')}>View Wishlist</button>
      <button onClick={() => navigate('/cart')}>View Cart</button>
      <button onClick={handleLogout}>Logout</button>
      {Object.entries(groupedProducts).map(([description, products]) => (
        <div key={description} className="category-section">
          <h2>{description}</h2>
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => handleAddToList(product, cart, setCart, 'cart')}>Add to Cart</button>
                <button onClick={() => handleAddToList(product, wishlist, setWishlist, 'wishlist')}>Add to Wishlist</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [productReviews, setProductReviews] = useState(() => JSON.parse(localStorage.getItem('productReviews')) || {});
  const navigate = useNavigate();

  // Mock product data with image URLs
  const mockProducts = [
    { id: 1, name: 'Product 1', description: 'Category 1', price: 10, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', description: 'Category 1', price: 20, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', description: 'Category 2', price: 15, image: 'https://via.placeholder.com/150' },
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  // Group products by description (category)
  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.description] = acc[product.description] || []).push(product);
    return acc;
  }, {});

  const handleAddToList = (item, list, setList, listName) => {
    if (!list.some(existingItem => existingItem.id === item.id)) {
      const updatedList = [...list, item];
      setList(updatedList);
      localStorage.setItem(listName, JSON.stringify(updatedList)); // Update localStorage
      alert(`${item.name} added to ${listName === 'wishlist' ? 'wishlist' : 'cart'}!`);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('You have logged out successfully!');
    navigate("/auth");
  };

  const handleAddReview = (productId) => {
    const review = prompt('Enter your review:');
    const rating = prompt('Enter your rating (1-5):');

    if (review && rating) {
      const updatedReviews = {
        ...productReviews,
        [productId]: [...(productReviews[productId] || []), { review, rating: parseInt(rating) }]
      };
      setProductReviews(updatedReviews);
      localStorage.setItem('productReviews', JSON.stringify(updatedReviews));
    }
  };

  const handleViewReviews = (productId) => {
    const reviews = productReviews[productId] || [];
    if (reviews.length === 0) {
      alert('No reviews yet for this product.');
    } else {
      const reviewMessages = reviews
        .map((review, index) => `Review ${index + 1}: ${review.review} - Rating: ${review.rating}`)
        .join('\n');
      alert(`Reviews for Product ${productId}:\n${reviewMessages}`);
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button onClick={() => navigate('/wishlist')}>View Wishlist</button>
      <button onClick={() => navigate('/cart')}>View Cart</button>
      <button onClick={handleLogout}>Logout</button>
      {Object.entries(groupedProducts).map(([description, products]) => (
        <div key={description} className="category-section">
          <h2>{description}</h2>
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <h2>{product.name}</h2>
                <img src={product.image} alt={product.name} style={{ width: '150px', height: '150px' }} />
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => handleAddToList(product, cart, setCart, 'cart')}>Add to Cart</button>
                <button onClick={() => handleAddToList(product, wishlist, setWishlist, 'wishlist')}>Add to Wishlist</button>
                <button onClick={() => handleAddReview(product.id)}>Add Review</button>
                <button onClick={() => handleViewReviews(product.id)}>View Reviews</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;

