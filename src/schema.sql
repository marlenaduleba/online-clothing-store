CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE token_blacklist (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    revoked_at TIMESTAMP NOT NULL
);

-- Creating a table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Automatically incremented ID
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'admin')) NOT NULL
);

-- Creating a table for products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,                  -- Automatically incremented product ID
    name VARCHAR(100) NOT NULL,             -- Product name
    description TEXT,                       -- Product description
    price DECIMAL(10, 2) NOT NULL,          -- Product price, accurate to two decimal places
    brand VARCHAR(50),                      -- Product brand
    category VARCHAR(50),                   -- Product category
    size VARCHAR(10)                        -- Product size
);

-- Adding indexes to frequently used columns
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_size ON products(size);

-- Resetting the sequence to start from 1
ALTER SEQUENCE public.products_id_seq RESTART WITH 1;

-- Creating a table for carts
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,                   -- Automatically incremented cart ID
    user_id INTEGER NOT NULL,                -- ID of the user who owns the cart
    total DECIMAL(10, 2) DEFAULT 0.00,       -- Total cost of the cart
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Cart creation timestamp
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Last update timestamp
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)                 -- Assuming there is a 'users' table with 'id' column
        ON DELETE CASCADE
);

-- Creating a table for cart items
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,                   -- Automatically incremented item ID
    cart_id INTEGER NOT NULL,                -- ID of the cart to which the item belongs
    product_id INTEGER NOT NULL,             -- ID of the product
    quantity INTEGER NOT NULL CHECK (quantity > 0), -- Product quantity (must be positive numbers)
    price DECIMAL(10, 2) NOT NULL,           -- Unit price of the product
    subtotal DECIMAL(10, 2) NOT NULL,        -- Item value (quantity * unit price)
    CONSTRAINT fk_cart
        FOREIGN KEY (cart_id) 
        REFERENCES carts(id)                 -- Assuming there is a 'carts' table with 'id' column
        ON DELETE CASCADE,
    CONSTRAINT fk_product
        FOREIGN KEY (product_id) 
        REFERENCES products(id)              -- Assuming there is a 'products' table with 'id' column
        ON DELETE CASCADE
);

-- Indexes for speeding up queries
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Creating a table for orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,                   -- Unique order ID
    user_id INTEGER NOT NULL,                -- ID of the user placing the order
    total DECIMAL(10, 2) NOT NULL,           -- Total cost of the order
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Order creation timestamp
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Last update timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) -- Foreign key to the users table
);

-- Creating a table for order items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,                   -- Unique order item ID
    order_id INTEGER NOT NULL,               -- Order ID
    product_id INTEGER NOT NULL,             -- Product ID
    quantity INTEGER NOT NULL,               -- Product quantity
    price DECIMAL(10, 2) NOT NULL,           -- Unit price of the product
    subtotal DECIMAL(10, 2) NOT NULL,        -- Subtotal cost (quantity * price)
    FOREIGN KEY (order_id) REFERENCES orders(id), -- Foreign key to the orders table
    FOREIGN KEY (product_id) REFERENCES products(id) -- Foreign key to the products table
);

-- Index on 'user_id' and 'order_id' columns in the 'order_items' table for better performance
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Inserting sample data (optional)
-- INSERT INTO orders (user_id, total) VALUES (1, 200.00);
-- INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (1, 1, 2, 100.00, 200.00);
