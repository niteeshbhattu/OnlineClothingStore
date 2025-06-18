<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');     // Replace with your database username
define('DB_PASSWORD', '');     // Replace with your database password
define('DB_NAME', 'dns_store'); // Replace with your database name

// Website configuration
define('SITE_NAME', 'DNS Store');
define('SITE_URL', 'http://localhost/dns-store'); // Replace with your website URL

// Email configuration
define('ADMIN_EMAIL', 'info@dnsstore.com');

// Cart configuration
define('FREE_SHIPPING_THRESHOLD', 50); // Minimum order amount for free shipping
define('SHIPPING_COST', 4.99); // Standard shipping cost

// Create database and tables if they don't exist
function initialize_database() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
    if (!$conn->query($sql)) {
        die("Error creating database: " . $conn->error);
    }
    
    // Select database
    $conn->select_db(DB_NAME);
    
    // Create products table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS products (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        die("Error creating products table: " . $conn->error);
    }
    
    // Create messages table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS messages (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        die("Error creating messages table: " . $conn->error);
    }
    
    // Create orders table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20),
        shipping_address TEXT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        die("Error creating orders table: " . $conn->error);
    }
    
    // Create order_items table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS order_items (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        order_id INT(11) NOT NULL,
        product_id INT(11) NOT NULL,
        quantity INT(11) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )";
    
    if (!$conn->query($sql)) {
        die("Error creating order_items table: " . $conn->error);
    }
    
    // Insert sample products if products table is empty
    $result = $conn->query("SELECT COUNT(*) as count FROM products");
    $row = $result->fetch_assoc();
    
    if ($row['count'] == 0) {
        $sample_products = [
            [
                'name' => 'Classic White T-Shirt',
                'price' => 19.99,
                'image' => 'img/placeholder.svg',
                'category' => 'T-Shirts',
                'description' => 'A comfortable classic white t-shirt made from 100% organic cotton, perfect for everyday wear. Features a regular fit and crew neck design.'
            ],
            [
                'name' => 'Black Slim-Fit Jeans',
                'price' => 49.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Jeans',
                'description' => 'Stylish black slim-fit jeans made from stretchy denim material. Perfect for casual or semi-formal occasions.'
            ],
            [
                'name' => 'Floral Summer Dress',
                'price' => 39.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Dresses',
                'description' => 'Beautiful floral summer dress with a flowy design. Made from lightweight material perfect for hot weather.'
            ],
            [
                'name' => 'Navy Blue Blazer',
                'price' => 89.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Outerwear',
                'description' => 'Elegant navy blue blazer suitable for formal events or business meetings. Features a modern cut and premium fabric.'
            ],
            [
                'name' => 'Athletic Sneakers',
                'price' => 59.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Footwear',
                'description' => 'Comfortable athletic sneakers with cushioned soles, perfect for running, gym workouts, or casual wear.'
            ],
            [
                'name' => 'Leather Belt',
                'price' => 29.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Accessories',
                'description' => 'High-quality leather belt with metal buckle. A versatile accessory for any outfit.'
            ],
            [
                'name' => 'Striped Polo Shirt',
                'price' => 34.99,
                'image' => 'img/placeholder.svg',
                'category' => 'T-Shirts',
                'description' => 'Classic striped polo shirt with a comfortable fit. Perfect for casual outings or golf sessions.'
            ],
            [
                'name' => 'Denim Jacket',
                'price' => 69.99,
                'image' => 'img/placeholder.svg',
                'category' => 'Outerwear',
                'description' => 'Trendy denim jacket with a vintage wash. A timeless piece that goes with almost any outfit.'
            ]
        ];
        
        $stmt = $conn->prepare("INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)");
        
        foreach ($sample_products as $product) {
            $stmt->bind_param("sdsss", $product['name'], $product['price'], $product['image'], $product['category'], $product['description']);
            $stmt->execute();
        }
        
        $stmt->close();
    }
    
    $conn->close();
}

// Initialize the database on first run
// Comment out this line after the first run if you don't want it to check every time
// initialize_database();
?>