// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('dnsCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('dnsCart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in header
function updateCartCount() {
  const cartCounts = document.querySelectorAll('.cart-count');
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCounts.forEach(count => {
    count.textContent = itemCount;
  });
  
  // Update cart items count on cart page if applicable
  const cartItemsCount = document.querySelector('.cart-items-count');
  if (cartItemsCount) {
    cartItemsCount.textContent = `${itemCount} ${itemCount === 1 ? 'Item' : 'Items'}`;
  }
}

// Add product to cart
function addToCart(product, quantity = 1) {
  if (!product) return;
  
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Product already in cart, update quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }
  
  // Show notification
  showNotification(`${product.name} added to cart!`);
  
  // Save updated cart
  saveCart();
}

// Remove product from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  
  // If on cart page, update cart display
  if (document.getElementById('cart-items-list')) {
    displayCart();
  }
}

// Update product quantity in cart
function updateQuantity(id, quantity) {
  const itemIndex = cart.findIndex(item => item.id === id);
  
  if (itemIndex >= 0) {
    cart[itemIndex].quantity = Math.max(1, quantity); // Minimum quantity is 1
    saveCart();
    
    // If on cart page, update cart display
    if (document.getElementById('cart-items-list')) {
      displayCart();
    }
  }
}

// Clear the entire cart
function clearCart() {
  cart = [];
  saveCart();
  
  // If on cart page, update cart display
  if (document.getElementById('cart-items-list')) {
    displayCart();
  }
}

// Calculate cart totals
function calculateCartTotals() {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  
  return { subtotal, shipping, total };
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'var(--primary)';
  notification.style.color = 'var(--white)';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = 'var(--radius)';
  notification.style.boxShadow = 'var(--shadow)';
  notification.style.zIndex = '1000';
  notification.style.transition = 'all 0.3s ease';
  notification.style.transform = 'translateY(100px)';
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateY(100px)';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Display cart items on cart page
function displayCart() {
  const cartItemsList = document.getElementById('cart-items-list');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');
  const shippingMessage = document.getElementById('shipping-message');
  
  if (!cartItemsList) return; // Not on cart page
  
  // Check if cart is empty
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartContent.style.display = 'grid';
  
  // Clear cart items list
  cartItemsList.innerHTML = '';
  
  // Add cart items
  cart.forEach(item => {
    const cartItemHtml = `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-content">
          <div class="cart-item-image">
            <a href="product-details.html?id=${item.id}">
              <img src="${item.image}" alt="${item.name}">
            </a>
          </div>
          <div class="cart-item-info">
            <a href="product-details.html?id=${item.id}">
              <h3 class="cart-item-title">${item.name}</h3>
            </a>
            <p class="cart-item-category">${item.category}</p>
            <div class="cart-item-actions">
              <div class="cart-quantity">
                <input 
                  type="number" 
                  min="1" 
                  value="${item.quantity}"
                  class="quantity-input"
                  data-id="${item.id}"
                >
              </div>
              <div class="cart-item-price">
                <div>Rs. ${(item.price * item.quantity).toFixed(2)}</div>
                <a href="#" class="remove-item" data-id="${item.id}">Remove</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    cartItemsList.innerHTML += cartItemHtml;
  });
  
  // Add event listeners to quantity inputs and remove buttons
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const id = parseInt(this.getAttribute('data-id'));
      const quantity = parseInt(this.value);
      updateQuantity(id, quantity);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const id = parseInt(this.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
  
  // Calculate and display totals
  const { subtotal, shipping, total } = calculateCartTotals();
  
  subtotalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
  shippingElement.textContent = shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`;
  totalElement.textContent = `Rs. ${total.toFixed(2)}`;
  
  // Update shipping message
  if (subtotal < 50) {
    const remaining = (50 - subtotal).toFixed(2);
    shippingMessage.textContent = `Add Rs. ${remaining} more to qualify for free shipping.`;
    shippingMessage.style.display = 'block';
  } else {
    shippingMessage.style.display = 'none';
  }
}

// Initialize clear cart button
function initClearCartButton() {
  const clearCartButton = document.getElementById('clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }
}

// Load cart when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  displayCart();
  initClearCartButton();
});c