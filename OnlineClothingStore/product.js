// Sample product data
const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 900,
    image: 'assets/whiteTshirt.jpg',
    category: 'T-Shirts',
    description: 'A comfortable classic white t-shirt made from 100% organic cotton, perfect for everyday wear. Features a regular fit and crew neck design.',
  },
  {
    id: 2,
    name: 'Black Slim-Fit Jeans',
    price: 1600,
    image: 'assets/blackJeansPant.jpg',
    category: 'Jeans',
    description: 'Stylish black slim-fit jeans made from stretchy denim material. Perfect for casual or semi-formal occasions.',
  },
  {
    id: 3,
    name: 'Floral Summer Dress',
    price: 1550,
    image: 'assets/summerDress.jpg',
    category: 'Dresses',
    description: 'Beautiful floral summer dress with a flowy design. Made from lightweight material perfect for hot weather.',
  },
  {
    id: 4,
    name: 'Navy Blue Blazer',
    price: 2000,
    image: 'assets/blueBlazzer.jpg',
    category: 'Outerwear',
    description: 'Elegant navy blue blazer suitable for formal events or business meetings. Features a modern cut and premium fabric.',
  },
  {
    id: 5,
    name: 'Athletic Sneakers',
    price: 4000,
    image: 'assets/athleticSneakers.jpg',
    category: 'Footwear',
    description: 'Comfortable athletic sneakers with cushioned soles, perfect for running, gym workouts, or casual wear.',
  },
  {
    id: 6,
    name: 'Leather Belt',
    price: 400,
    image: 'assets/leatherBelt.jpg',
    category: 'Accessories',
    description: 'High-quality leather belt with metal buckle. A versatile accessory for any outfit.',
  },
  {
    id: 7,
    name: 'Striped Polo Shirt',
    price: 1300,
    image: 'assets/poloTshirt.jpg',
    category: 'T-Shirts',
    description: 'Classic striped polo shirt with a comfortable fit. Perfect for casual outings or golf sessions.',
  },
  {
    id: 8,
    name: 'Denim Jacket',
    price: 2500,
    image: 'assets/denimJacket.jpg',
    category: 'Outerwear',
    description: 'Trendy denim jacket with a vintage wash. A timeless piece that goes with almost any outfit.',
  }
];

// Helper functions
function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find(product => product.id === Number(id));
}

function getProductsByCategory(category) {
  return products.filter(product => product.category === category);
}

function getUniqueCategories() {
  const categories = products.map(product => product.category);
  return [...new Set(categories)];
}

function searchProducts(query) {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
}

// Product card HTML template
function createProductCard(product) {
  return `
    <div class="product-card">
      <a href="product-details.html?id=${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
      </a>
      <div class="product-info">
        <a href="product-details.html?id=${product.id}">
          <h3>${product.name}</h3>
        </a>
        <p class="product-category">${product.category}</p>
        <div class="product-card-actions">
          <div class="product-price">Rs. ${product.price.toFixed(2)}</div>
          <button class="btn btn-primary add-to-cart" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

// For category cards on the homepage
function createCategoryCard(category) {
  return `
    <a href="products.html?category=${encodeURIComponent(category)}" class="category-card">
      <div class="category-icon">${category.charAt(0)}</div>
      <h3>${category}</h3>
    </a>
  `;
}

// Function to initialize products page
function initProductsPage() {
  const productsGrid = document.getElementById('products-grid');
  const categoryFilters = document.getElementById('category-filters');
  const searchInput = document.getElementById('product-search');
  const noProductsMessage = document.getElementById('no-products-message');
  
  if (!productsGrid) return; // Not on products page
  
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  // Initialize with all products or filtered by category
  let currentProducts = categoryParam ? getProductsByCategory(categoryParam) : getAllProducts();
  
  // Display products
  function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
      noProductsMessage.style.display = 'block';
    } else {
      noProductsMessage.style.display = 'none';
      productsToShow.forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
      });
    }
    
    // Add event listeners to newly created "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const productId = this.getAttribute('data-id');
        addToCart(getProductById(productId), 1);
      });
    });
  }
  
  // Display initial products
  displayProducts(currentProducts);
  
  // Create category filters
  const categories = getUniqueCategories();
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = category;
    button.dataset.category = category;
    
    if (category === categoryParam) {
      button.classList.add('active');
      
      // Also set the "All" button to inactive
      document.querySelector('.filter-btn[data-category="all"]').classList.remove('active');
    }
    
    categoryFilters.appendChild(button);
  });
  
  // Add event listeners to filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to this button
      this.classList.add('active');
      
      const category = this.dataset.category;
      
      // Filter products
      if (category === 'all') {
        currentProducts = getAllProducts();
      } else {
        currentProducts = getProductsByCategory(category);
      }
      
      // Apply search filter if search input has value
      if (searchInput.value) {
        currentProducts = currentProducts.filter(product => 
          product.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
          product.description.toLowerCase().includes(searchInput.value.toLowerCase())
        );
      }
      
      displayProducts(currentProducts);
    });
  });
  
  // Add event listener to search input
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      let searchResults;
      
      // Get currently filtered products (by category)
      const activeFilter = document.querySelector('.filter-btn.active');
      const category = activeFilter.dataset.category;
      
      if (category === 'all') {
        searchResults = searchProducts(query);
      } else {
        searchResults = getProductsByCategory(category).filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      displayProducts(searchResults);
    });
  }
}

// Function to initialize featured products on homepage
function initFeaturedProducts() {
  const featuredProductsContainer = document.getElementById('featured-products');
  if (!featuredProductsContainer) return; // Not on homepage
  
  const featuredProducts = getAllProducts().slice(0, 4); // First 4 products
  
  featuredProducts.forEach(product => {
    featuredProductsContainer.innerHTML += createProductCard(product);
  });
  
  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const productId = this.getAttribute('data-id');
      addToCart(getProductById(productId), 1);
    });
  });
}

// Function to initialize categories on homepage
function initCategories() {
  const categoryGrid = document.getElementById('category-grid');
  if (!categoryGrid) return; // Not on homepage
  
  const categories = getUniqueCategories();
  
  categories.forEach(category => {
    categoryGrid.innerHTML += createCategoryCard(category);
  });
}

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
  initProductsPage();
  initFeaturedProducts();
  initCategories();
  
  // Add event listener to mobile menu button
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }
});