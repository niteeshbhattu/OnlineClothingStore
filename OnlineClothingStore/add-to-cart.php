<?php
// This script handles adding products to the cart from AJAX requests

// Set headers for JSON response
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Start session to store cart data
session_start();

// Get product data from request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Get product ID and quantity
$productId = filter_var($data['productId'] ?? 0, FILTER_VALIDATE_INT);
$quantity = filter_var($data['quantity'] ?? 1, FILTER_VALIDATE_INT);

// Validate inputs
if (!$productId || $productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
    exit;
}

if (!$quantity || $quantity <= 0) {
    $quantity = 1;
}

// Load product data (in a real application, you would fetch this from a database)
// For this example, we'll use a static array of products
require_once 'config.php'; // Contains database configuration

try {
    // Create database connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Get product details
    $stmt = $conn->prepare("SELECT id, name, price, image, category FROM products WHERE id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Product not found");
    }
    
    $product = $result->fetch_assoc();
    
    // Initialize cart if it doesn't exist
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    // Check if product already exists in cart
    $productExists = false;
    foreach ($_SESSION['cart'] as &$item) {
        if ($item['id'] === $productId) {
            $item['quantity'] += $quantity;
            $productExists = true;
            break;
        }
    }
    
    // If product doesn't exist in cart, add it
    if (!$productExists) {
        $_SESSION['cart'][] = [
            'id' => $productId,
            'name' => $product['name'],
            'price' => $product['price'],
            'image' => $product['image'],
            'category' => $product['category'],
            'quantity' => $quantity
        ];
    }
    
    // Calculate cart total
    $totalItems = 0;
    foreach ($_SESSION['cart'] as $item) {
        $totalItems += $item['quantity'];
    }
    
    echo json_encode([
        'success' => true, 
        'message' => $product['name'] . ' added to cart',
        'totalItems' => $totalItems
    ]);
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>