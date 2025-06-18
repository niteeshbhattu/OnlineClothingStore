// Function to get URL parameters
function getUrlParameter(name) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(name);
}

// Initialize product details page
function initProductDetails() {
  const productId = getUrlParameter('id');
  
  if (!productId) {
    window.location.href = './products.html';
    return;
  }
  
  // Get product details
  const product = getProductById(parseInt(productId));
  
  if (!product) {
    window.location.href = './products.html';
    return;
  }
  
  // Update page elements with product details
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-price').textContent = `Rs. ${product.price.toFixed(2)}`;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('product-image').src = product.image;
  document.getElementById('product-image').alt = product.name;
  
  // Set document title
  document.title = `${product.name} - DNS The Online Clothing Store`;
  
  // Set up Add to Cart button
  document.getElementById('add-to-cart').addEventListener('click', function() {
    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(product, quantity);
  });
  
  // Load related products (same category)
  loadRelatedProducts(product);
}

// Load related products
function loadRelatedProducts(product) {
  const relatedProductsContainer = document.getElementById('related-products');
  
  // Filter products in the same category but exclude current product
  const related = getAllProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4); // Limit to 4 products
  
  // Clear container and add related products
  relatedProductsContainer.innerHTML = '';
  
  if (related.length === 0) {
    relatedProductsContainer.parentElement.style.display = 'none';
    return;
  }
  
  related.forEach(relatedProduct => {
    relatedProductsContainer.innerHTML += createProductCard(relatedProduct);
  });
  
  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const productId = this.getAttribute('data-id');
      addToCart(getProductById(parseInt(productId)), 1);
    });
  });
}

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', initProductDetails);