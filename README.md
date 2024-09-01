# Online Clothing Store API

## Content

- [Description](#description)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Carts](#carts)
  - [Orders](#orders)
- [Running the Project](#running-the-project)

## Description

The Online Clothing Store API allows customers to search for specific clothing items in their size, add items to their carts, and place orders. The API supports user authentication to provide a personalized shopping experience.

## Technology Stack

<img src="https://github.com/user-attachments/assets/9b53ecc0-c37a-433a-b146-66fe7340d7b2" alt="Node.js" height="24" align="center"/>&nbsp; **Node.js** - For running the server-side application.

<img src="https://github.com/user-attachments/assets/cf65b516-de39-4cf8-bdef-ff09b2f187b5" alt="Express.js" height="24" align="center"/>&nbsp; **Express.js** - For building the RESTful API.

<img src="https://github.com/user-attachments/assets/94839a39-279d-43c1-89d7-7f460ed78e56" alt="TypeScript" height="24" align="center"/>&nbsp; **TypeScript** - For type safety and improved developer experience.

<img src="https://github.com/user-attachments/assets/edd03751-3aee-4d2c-befd-bddbd4d10a8b" alt="PostgreSQL" height="24" align="center"/>&nbsp; **PostgreSQL** - Relational database to store product, user, and order information.

<img src="https://github.com/user-attachments/assets/30e8c509-da90-44c4-9b85-c6e515fe4e30" alt="bcrypt" height="24" align="center"/>&nbsp; **bcrypt** - For hashing user passwords.

<img src="https://github.com/user-attachments/assets/cc786919-f195-44c2-9c97-6df104017ab9" alt="JWT" height="24" align="center"/>&nbsp; **Custom JWT Implementation** - For managing user authentication and authorization (implemented manually).

<img src="https://github.com/user-attachments/assets/428687f9-ebcc-4507-9990-3f55f8ef0dbb" alt="Jest" height="24" align="center"/>&nbsp; **Jest** - For unit and integration testing.

## Database Schema

<details>
  <summary><strong>Tables</strong></summary>

#### Users

The `users` table stores information about the users of the application.

| Column     | Data Type    | Constraints                                 | Description                                 |
| ---------- | ------------ | ------------------------------------------- | ------------------------------------------- |
| id         | SERIAL       | Primary Key                                 | Unique identifier for each user.            |
| first_name | VARCHAR(50)  | Not Null                                    | First name of the user.                     |
| last_name  | VARCHAR(50)  | Not Null                                    | Last name of the user.                      |
| email      | VARCHAR(100) | Not Null, Unique                            | Email address of the user.                  |
| password   | VARCHAR(255) | Not Null                                    | Hashed password of the user.                |
| role       | VARCHAR(20)  | Not Null, CHECK (role IN ('user', 'admin')) | Role of the user, either `user` or `admin`. |

#### Products

The `products` table stores information about the products available in the store.

| Column      | Data Type      | Constraints | Description                                           |
| ----------- | -------------- | ----------- | ----------------------------------------------------- |
| id          | SERIAL         | Primary Key | Unique identifier for each product.                   |
| name        | VARCHAR(100)   | Not Null    | Name of the product.                                  |
| description | TEXT           |             | Detailed description of the product.                  |
| price       | DECIMAL(10, 2) | Not Null    | Price of the product, accurate to two decimal places. |
| brand       | VARCHAR(50)    |             | Brand of the product.                                 |
| category    | VARCHAR(50)    |             | Category of the product.                              |
| size        | VARCHAR(10)    |             | Size of the product.                                  |

#### Carts

The `carts` table stores information about the shopping carts created by users.

| Column     | Data Type      | Constraints               | Description                                               |
| ---------- | -------------- | ------------------------- | --------------------------------------------------------- |
| id         | SERIAL         | Primary Key               | Unique identifier for each cart.                          |
| user_id    | INTEGER        | Not Null, Foreign Key     | References `users(id)`; ID of the user who owns the cart. |
| total      | DECIMAL(10, 2) | Default 0.00              | Total cost of the cart.                                   |
| created_at | TIMESTAMPTZ    | Default CURRENT_TIMESTAMP | Timestamp when the cart was created.                      |
| updated_at | TIMESTAMPTZ    | Default CURRENT_TIMESTAMP | Timestamp when the cart was last updated.                 |

#### Cart Items

The `cart_items` table stores the individual items added to a user's cart.

| Column     | Data Type      | Constraints                    | Description                                                  |
| ---------- | -------------- | ------------------------------ | ------------------------------------------------------------ |
| id         | SERIAL         | Primary Key                    | Unique identifier for each cart item.                        |
| cart_id    | INTEGER        | Not Null, Foreign Key          | References `carts(id)`; ID of the cart containing this item. |
| product_id | INTEGER        | Not Null, Foreign Key          | References `products(id)`; ID of the product in the cart.    |
| quantity   | INTEGER        | Not Null, CHECK (quantity > 0) | Quantity of the product in the cart (must be positive).      |
| price      | DECIMAL(10, 2) | Not Null                       | Price of the product at the time it was added to the cart.   |
| subtotal   | DECIMAL(10, 2) | Not Null                       | Subtotal cost for this item (quantity \* price).             |

#### Orders

The `orders` table stores information about orders placed by users.

| Column     | Data Type      | Constraints               | Description                                                  |
| ---------- | -------------- | ------------------------- | ------------------------------------------------------------ |
| id         | SERIAL         | Primary Key               | Unique identifier for each order.                            |
| user_id    | INTEGER        | Not Null, Foreign Key     | References `users(id)`; ID of the user who placed the order. |
| total      | DECIMAL(10, 2) | Not Null                  | Total cost of the order.                                     |
| created_at | TIMESTAMPTZ    | Default CURRENT_TIMESTAMP | Timestamp when the order was created.                        |
| updated_at | TIMESTAMPTZ    | Default CURRENT_TIMESTAMP | Timestamp when the order was last updated.                   |

#### Order Items

The `order_items` table stores information about the products included in each order.

| Column     | Data Type      | Constraints           | Description                                                    |
| ---------- | -------------- | --------------------- | -------------------------------------------------------------- |
| id         | SERIAL         | Primary Key           | Unique identifier for each order item.                         |
| order_id   | INTEGER        | Not Null, Foreign Key | References `orders(id)`; ID of the order containing this item. |
| product_id | INTEGER        | Not Null, Foreign Key | References `products(id)`; ID of the product in the order.     |
| quantity   | INTEGER        | Not Null              | Quantity of the product in the order.                          |
| price      | DECIMAL(10, 2) | Not Null              | Price of the product at the time it was ordered.               |
| subtotal   | DECIMAL(10, 2) | Not Null              | Subtotal cost for this item (quantity \* price).               |

#### Refresh Tokens

The `refresh_tokens` table stores refresh tokens for user sessions.

| Column     | Data Type    | Constraints           | Description                                                |
| ---------- | ------------ | --------------------- | ---------------------------------------------------------- |
| id         | SERIAL       | Primary Key           | Unique identifier for each refresh token.                  |
| user_id    | INTEGER      | Foreign Key, Not Null | References `users(id)`; ID of the user who owns the token. |
| token      | VARCHAR(255) | Not Null, Unique      | The refresh token itself.                                  |
| expires_at | TIMESTAMP    | Not Null              | Expiration time of the refresh token.                      |

#### Token Blacklist

The `token_blacklist` table stores tokens that have been revoked and should no longer be accepted.

| Column     | Data Type    | Constraints      | Description                                   |
| ---------- | ------------ | ---------------- | --------------------------------------------- |
| id         | SERIAL       | Primary Key      | Unique identifier for each blacklisted token. |
| token      | VARCHAR(255) | Not Null, Unique | The token that has been blacklisted.          |
| revoked_at | TIMESTAMP    | Not Null         | Timestamp when the token was revoked.         |

</details>
<details>
<summary><strong>Indexes</strong></summary>

Indexes are created to optimize the performance of database queries, especially for frequently searched columns.

- **Products Table**:
  - `idx_products_brand` on `brand`
  - `idx_products_category` on `category`
  - `idx_products_size` on `size`
- **Cart Items Table**:
  - `idx_cart_items_cart_id` on `cart_id`
  - `idx_cart_items_product_id` on `product_id`
- **Order Items Table**:

  - `idx_order_items_order_id` on `order_id`
  - `idx_order_items_product_id` on `product_id`
  </details>
  <details>
  <summary><strong>Relationships</strong></summary>

- **Users to Orders**: One-to-Many relationship.
  - Each user can place multiple orders, but each order is associated with a single user.
- **Users to Carts**: One-to-One relationship.
  - Each user has one active cart at a time.
- **Carts to CartItems**: One-to-Many relationship.
  - Each cart can contain multiple items, but each cart item references a single cart.
- **Orders to OrderItems**: One-to-Many relationship.
  - Each order can contain multiple items, but each order item references a single order.
- **Products to CartItems** and **Products to OrderItems**: One-to-Many relationship.

  - Each product can appear in multiple cart or order items, but each item references a single product.
  </details>
  <details>
  <summary><strong>Additional Information</strong></summary>

- **Automatic Increment**: The `SERIAL` data type is used for primary keys to ensure automatic incrementing of ID values.
- **Timestamps**: The `created_at` and `updated_at` columns in tables like `carts`, `orders`, and `order_items` track when records are created and last updated, providing an audit trail.
- **Cascade Deletions**: Foreign key constraints are set to `ON DELETE CASCADE` where appropriate to ensure that related records are automatically removed when a parent record is deleted, maintaining referential integrity.
</details>
<details>
<summary><strong>Schema Maintenance</strong></summary>

- **Resetting Sequences**: The sequence for the `products` table has been reset using `ALTER SEQUENCE public.products_id_seq RESTART WITH 1` to start the auto-increment from 1.
</details>

## Base URL

`http://localhost:3000`

## API Endpoints

### Authentication

<details>
   <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/auth/register</code>&nbsp;&nbsp;<strong>- User Registration</strong></summary>

- **Description**: This endpoint registers a new user with the provided details. The role is automatically assigned as `user` and cannot be specified during registration.
- **Endpoint**: `/api/v1/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string"
  }
  ```
- **Response**:
  - `201 Created` on successful registration with user details (role will be assigned as `user`)
  - `400 Bad Request` on invalid input or if the user already exists
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "Jon",
    "last_name": "Snow"
  }'
  ```

- **Example Response**:

  ```json
  {
    "message": "User registered",
    "user": {
      "id": 1,
      "first_name": "Jon",
      "last_name": "Snow",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

  </details>

<details>
   <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/auth/login</code>&nbsp;&nbsp;<strong>- User Login</strong></summary>

- **Description**: This endpoint authenticates a user and returns a JWT token if the credentials are valid. The token can be used to access protected routes and resources.
- **Endpoint**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK` with JWT token and refresh token
  - `401 Unauthorized` on invalid credentials
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
  ```

- **Example Response**:

  ```json
  {
    "message": "Logged in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "1eaac022e8618075693da556a2039...",
    "role": "user"
  }
  ```

    </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/auth/logout</code>&nbsp;&nbsp;<strong>- User Logout</strong></summary>

- **Description**: This endpoint logs out the user by invalidating their JWT token and refresh token. After successful logout, the token should no longer be accepted for authenticated requests.
- **Endpoint**: `/api/v1/auth/logout`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token to be invalidated.
- **Request Body**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response**:
  - `200 OK` with a JSON response indicating successful logout
  - `401 Unauthorized` if the token is invalid or missing
  - `400 Bad Request` if the refresh token is missing
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/auth/logout' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "refreshToken": "dGhpcyBpcyBhIHNhbXBsZSByZWZyZXNoIHRva2Vu"
  }'
  ```

- **Example Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
    </details>

<details>
  <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/auth/refresh</code>&nbsp;&nbsp;<strong>- Refresh Token</strong></summary>

- **Description**: This endpoint refreshes the JWT token using a valid refresh token.
- **Endpoint**: `/api/v1/auth/refresh`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response**:
  - `200 OK` with new JWT token
  - `401 Unauthorized` if the refresh token is invalid or expired
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/auth/refresh' \
  -H 'Content-Type: application/json' \
  -d '{
    "refreshToken": "dGhpcyBpcyBhIHNhbXBsZSByZWZyZXNoIHRva2Vu"
  }'
  ```

- **Example Response**:

  ```json
  {
    "message": "Token refreshed",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJtYXJs..."
  }
  ```

    </details>

<details>
  <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/me</code>&nbsp;&nbsp;<strong>- Get Current User</strong></summary>
  
- **Description**: This endpoint retrieves the details of the currently logged-in user.
- **Endpoint**: `/api/v1/me`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
- **Response**:
  - `200 OK` with currently logged user's details
  - `401 Unauthorized` on invalid credentials
    
- **Example Request**:

```sh
curl '{base_url}/api/v1/me' \
-H 'Authorization: Bearer {token}'
```

- **Example Response**:

  ```json
  {
    "message": "User data retrieved successfully",
    "user": {
      "id": 1,
      "first_name": "Jon",
      "last_name": "Snow",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

    </details>

### Users

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/admin/users</code>&nbsp;&nbsp;<strong>- Create User (Admin Only)</strong></summary>

- **Description**: This endpoint is used by administrators to create a new user in the system. The request must include the role of the new user, which is assigned by the administrator. This ensures that the user is assigned appropriate permissions from the moment of creation. Access to this endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "role": "string" // Possible values: "user", "admin"
  }
  ```
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:
  - `201 Created` with details of the newly created user, including assigned role
  - `400 Bad Request` if the request body is invalid or missing required fields
  - `422 Unprocessable Entity` if the email is already in use or other validation errors
  - `403 Forbidden` if the authenticated user does not have the necessary permissions to create a new user
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/admin/users' \
  -H 'Authorization: Bearer {admin_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "Jon",
    "last_name": "Snow",
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "email": "user@example.com",
    "first_name": "Jon",
    "last_name": "Snow",
    "role": "user"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/users</code>&nbsp;&nbsp;<strong>- Get All Users (Admin Only)</strong></summary>

- **Description**: This endpoint retrieves a list of all users in the system. It is restricted to administrators or users with specific permissions. Access to this endpoint should be granted only to those with administrative privileges.
- **Endpoint**: `/api/v1/admin/users`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:
  - `200 OK` with a list of users
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the authenticated user does not have the necessary permissions to access the user list
- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/admin/users' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "email": "user@example.com",
      "first_name": "Jon",
      "last_name": "Snow",
      "role": "user"
    },
    {
      "id": "2",
      "email": "user2@example.com",
      "first_name": "Arya",
      "last_name": "Stark",
      "role": "admin"
    }
  ]
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/users/{id}</code>&nbsp;&nbsp;<strong>- Get User by ID (Admin Only)</strong></summary>

- **Description**: Retrieves detailed information about a specific user based on the user ID. This endpoint is accessible only to administrators. Administrators can view details of any user.
- **Endpoint**: `/api/v1/admin/users/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the user whose details are being retrieved
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only administrators with a valid token should be able to access this endpoint.
- **Response**:

  - `200 OK` with user details including role
  - `404 Not Found` if the user does not exist
  - `403 Forbidden` if the user does not have admin privileges

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/admin/users/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "email": "user@example.com",
    "first_name": "Jon",
    "last_name": "Snow",
    "role": "user"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/PUT-FF8C00" align="center">&nbsp; &nbsp; <code>/api/v1/admin/users/{id}</code>&nbsp;&nbsp;<strong>- Update User by ID (Admin Only)</strong></summary>

- **Description**: Updates the details of a specific user based on their ID. This endpoint is accessible only to administrators. Administrators can update user details, including roles.
- **Endpoint**: `/api/v1/admin/users/{id}`
- **Method**: `PUT`
- **Path Parameters**:
  - `id` (string, required) - The ID of the user whose details are being updated
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only administrators with a valid token should be able to access this endpoint.
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **Response**:

  - `200 OK` with updated user details
  - `400 Bad Request` on validation error
  - `404 Not Found` if the user does not exist
  - `403 Forbidden` if the user does not have admin privileges

- **Example Request**:

  ```sh
  curl -X PUT '{base_url}/api/v1/admin/users/{id}' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {admin_token}' \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "new-user@example.com",
    "password": "new-password123",
    "role": "admin"
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "email": "new-user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/admin/users/{id}</code>&nbsp;&nbsp;<strong>- Delete User by ID (Admin Only)</strong></summary>

- **Description**: This endpoint allows administrators to delete a specific user from the system based on the user ID. Access to this endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/users/{id}`
- **Method**: `DELETE`
- **Path Parameters**:
  - `id` (string, required) - The ID of the user to be deleted
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:

  - `200 OK` on successful deletion
  - `404 Not Found` if the user does not exist
  - `403 Forbidden` if the authenticated user does not have permission to delete the user

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/admin/users/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  {}
  ```

</details>

### Products

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/admin/products</code>&nbsp;&nbsp;<strong>- Create Product (Admin Only)</strong></summary>

- **Description**: This endpoint is used by administrators to create a new product in the system. Access to this endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/products`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "brand": "string",
    "category": "string",
    "size": "string"
  }
  ```
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:
  - `201 Created` with details of the newly created product
  - `400 Bad Request` if the request body is invalid or missing required fields
  - `403 Forbidden` if the authenticated user does not have the necessary permissions to create a new product
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/admin/products' \
  -H 'Authorization: Bearer {admin_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "brand": "Brand Name",
    "category": "Category Name",
    "size": "M"
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "brand": "Brand Name",
    "category": "Category Name",
    "size": "M"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/products</code>&nbsp;&nbsp;<strong>- Get All Products</strong></summary>

- **Description**: This endpoint retrieves a list of all products in the system. Access to this endpoint is public.
- **Endpoint**: `/api/v1/products`
- **Method**: `GET`
- **Response**:
  - `200 OK` with a list of products
  - `500 Internal Server Error` if there is a server error
- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/products'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "name": "Product Name",
      "description": "Product Description",
      "price": 19.99,
      "brand": "Brand Name",
      "category": "Category Name",
      "size": "M"
    },
    {
      "id": "2",
      "name": "Another Product",
      "description": "Another Description",
      "price": 29.99,
      "brand": "Another Brand",
      "category": "Another Category",
      "size": "L"
    }
  ]
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/products/{id}</code>&nbsp;&nbsp;<strong>- Get Product by ID</strong></summary>

- **Description**: Retrieves detailed information about a specific product based on the product ID. Access to this endpoint is public.
- **Endpoint**: `/api/v1/products/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the product whose details are being retrieved
- **Response**:

  - `200 OK` with product details
  - `404 Not Found` if the product does not exist
  - `500 Internal Server Error` if there is a server error

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/products/{id}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "brand": "Brand Name",
    "category": "Category Name",
    "size": "M"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/products/search</code>&nbsp;&nbsp;<strong>- Search Products</strong></summary>

- **Description**: This endpoint allows users to search for products based on a query parameter. Access to this endpoint is public.
- **Endpoint**: `/api/v1/products/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (string, required) - The search term for the products
- **Response**:

  - `200 OK` with a list of products matching the search term
  - `400 Bad Request` if the query parameter is missing
  - `500 Internal Server Error` if there is a server error

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/products/search?q=term'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "name": "Product Name",
      "description": "Product Description",
      "price": 19.99,
      "brand": "Brand Name",
      "category": "Category Name",
      "size": "M"
    }
  ]
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/PUT-FF8C00" align="center">&nbsp; &nbsp; <code>/api/v1/admin/products/{id}</code>&nbsp;&nbsp;<strong>- Update Product by ID (Admin Only)</strong></summary>

- **Description**: Updates the details of a specific product based on the product ID. This endpoint is accessible only to administrators.
- **Endpoint**: `/api/v1/admin/products/{id}`
- **Method**: `PUT`
- **Path Parameters**:
  - `id` (string, required) - The ID of the product whose details are being updated
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only administrators with a valid token should be able to access this endpoint.
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "brand": "string",
    "category": "string",
    "size": "string"
  }
  ```
- **Response**:

  - `200 OK` with updated product details
  - `400 Bad Request` on validation error
  - `404 Not Found` if the product does not exist
  - `403 Forbidden` if the authenticated user does not have admin privileges

- **Example Request**:

  ```sh
  curl -X PUT '{base_url}/api/v1/admin/products/{id}' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {admin_token}' \
  -d '{
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "price": 24.99,
    "brand": "Updated Brand Name",
    "category": "Updated Category Name",
    "size": "L"
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "price": 24.99,
    "brand": "Updated Brand Name",
    "category": "Updated Category Name",
    "size": "L"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/admin/products/{id}</code>&nbsp;&nbsp;<strong>- Delete Product by ID (Admin Only)</strong></summary>

- **Description**: This endpoint allows administrators to delete a specific product from the system based on the product ID. Access to this endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/products/{id}`
- **Method**: `DELETE`
- **Path Parameters**:
  - `id` (string, required) - The ID of the product to be deleted
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:

  - `200 OK` on successful deletion
  - `404 Not Found` if the product does not exist
  - `403 Forbidden` if the

authenticated user does not have permission to delete the product

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/admin/products/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  {}
  ```

</details>

### Carts

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/me/cart</code>&nbsp;&nbsp;<strong>- Add Item to Cart</strong></summary>

- **Description**: Adds an item to the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/me/cart`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can modify their own cart.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "product_id": "number", // The ID of the product to be added to the cart
    "quantity": "number", // The quantity of the product to be added
    "price": "number" // The price of the product to be added
  }
  ```
- **Response**:

  - `201 Created` with details of the added cart item
  - `400 Bad Request` on validation error (e.g., invalid product ID, quantity not a positive integer)
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the specified product does not exist

- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/me/cart' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "price": 50.0
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "cart_id": "1",
    "product_id": "1",
    "quantity": 2,
    "price": 50.0,
    "subtotal": 100.0
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/me/cart</code>&nbsp;&nbsp;<strong>- Get Current User's Cart</strong></summary>

- **Description**: Retrieves the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user has access to their own cart.
- **Endpoint**: `/api/v1/me/cart`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can access their own cart.
- **Response**:

  - `200 OK` with cart details
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the cart for the current user does not exist

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/me/cart' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "id": "1",
        "cart_id": "1",
        "product_id": "1",
        "quantity": 2,
        "price": 50.0,
        "subtotal": 100.0
      }
    ],
    "total": 100.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/PUT-FF8C00" align="center">&nbsp; &nbsp; <code>/api/v1/me/cart</code>&nbsp;&nbsp;<strong>- Update Cart</strong></summary>

- **Description**: Updates the shopping cart of the currently logged-in user. This endpoint allows for updating the quantity of items in the cart. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/me/cart`
- **Method**: `PUT`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can modify their own cart.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "cart_item_id": "number", // The ID of the cart item
    "quantity": "number" // The updated quantity of the product
  }
  ```
- **Response**:

  - `200 OK` with updated cart item details
  - `400 Bad Request` on validation error (e.g., invalid cart item ID, quantity not a positive integer)
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the cart item does not exist

- **Example Request**:

  ```sh
  curl -X PUT '{base_url}/api/v1/me/cart' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "cart_item_id": 1,
    "quantity": 3
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "cart_id": "1",
    "product_id": "1",
    "quantity": 3,
    "price": 50.0,
    "subtotal": 150.0
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/me/cart</code>&nbsp;&nbsp;<strong>- Clear Cart</strong></summary>

- **Description**: Clears all items from the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/me/cart`
- **Method**: `DELETE`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can clear their own cart.
- **Response**:

  - `200 OK` with the empty cart details
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the cart does not exist

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/me/cart' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [],
    "total": 0.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

</details>

### Orders

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/me/orders</code>&nbsp;&nbsp;<strong>- Create Order</strong></summary>

- **Description**: Creates a new order for the currently logged-in user. This endpoint is accessible only to authenticated users.
- **Endpoint**: `/api/v1/me/orders`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product_id": "number",
        "quantity": "number",
        "price": "number"
      }
    ]
  }
  ```
- **Response**:

  - `201 Created` with the details of the created order
  - `400 Bad Request` on validation error
  - `401 Unauthorized` if the token is missing or invalid

- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/me/orders' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 50.0
      }
    ]
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "total": 100.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders</code>&nbsp;&nbsp;<strong>- Get All Orders (Admin Only)</strong></summary>

- **Description**: Retrieves a list of all orders in the system. This endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/orders`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
- **Response**:

  - `200 OK` with a list of orders
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the authenticated user does not have the necessary permissions

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/admin/orders' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "user_id": "1",
      "total": 100.0,
      "created_at": "2024-07-16T10:00:00Z",
      "updated_at": "2024-07-16T10:10:00Z"
    },
    {
      "id": "2",
      "user_id": "2",
      "total": 200.0,
      "created_at": "2024-07-17T11:00:00Z",
      "updated_at": "2024-07-17T11:10:00Z"
    }
  ]
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders/{id}</code>&nbsp;&nbsp;<strong>- Get Order by ID (Admin Only)</strong></summary>

- **Description**: Retrieves detailed information about a specific order based on the order ID. This endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/orders/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be retrieved
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
- **Response**:

  - `200 OK` with order details
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the authenticated user does not have the necessary permissions
  - `404 Not Found` if the order does not exist

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/admin/orders/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "total": 100.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/me/orders</code>&nbsp;&nbsp;<strong>- Get Current User's Orders</strong></summary>

- **Description**: Retrieves a list of all orders placed by the currently logged-in user. This endpoint is accessible only to authenticated users.
- **Endpoint**: `/api/v1/me/orders`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
- **Response**:

  - `200 OK` with a list of the user's orders
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the user has no orders

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/me/orders' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "user_id": "1",
      "total": 100.0,
      "created_at": "2024-07-16T10:00:00Z",
      "updated_at": "2024-07-16T10:10:00Z"
    }
  ]
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/me/orders/{id}</code>&nbsp;&nbsp;<strong>- Get Current User's Order by ID</strong></summary>

- **Description**: Retrieves detailed information about a specific order placed by the currently logged-in user based on the order ID. This endpoint is accessible only to authenticated users.
- **Endpoint**: `/api/v1/me/orders/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be retrieved
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization.
- **Response**:

  - `200 OK` with order details
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the order does not exist or does not belong to the current user

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/me/orders/{id}' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "total": 100.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders/{id}</code>&nbsp;&nbsp;<strong>- Delete Order by ID (Admin Only)</strong></summary>

- **Description**: Deletes a specific order based on the order ID. This endpoint is restricted to administrators.
- **Endpoint**: `/api/v1/admin/orders/{id}`
- **Method**: `DELETE`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be deleted
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Must belong to an administrator.
- **Response**:

  - `200 OK` on successful deletion
  - `404 Not Found` if the order does not exist
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the authenticated user does not have the necessary permissions

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/admin/orders/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Success Response**:

  ```json
  {
    "message": "Order successfully deleted"
  }
  ```

- **Example Error Response (`404 Not Found`)**:

  ```json
  {
    "message": "Order not found"
  }
  ```

</details>

## Running the Project

To run the Online Clothing Store API using Docker, follow these steps:

1. **Clone the Repository**:
   Clone the repository to your local machine.

   ```bash
   git clone https://github.com/your-repo/online-clothing-store-api.git
   cd online-clothing-store-api
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root of your project by copying the `.env.example` file provided in the repository. Ensure this file is correctly configured with your database connection details, JWT secret, and any other required environment variables.

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file as needed to include your specific configuration.

3. **Build and Start Containers**:
   Use Docker Compose to build the Docker images and start the containers.

   ```bash
   docker-compose up --build
   ```

   - The `--build` flag ensures that Docker Compose rebuilds the images before starting the containers. This is useful if you've made changes to the Dockerfile or the application code.

4. **Access the API**:
   Once the containers are up and running, the API should be accessible at `http://localhost:3000`.

5. **Testing**:
   To run tests, you can execute commands inside the application container. First, get the container ID or name using `docker ps`, then use `docker exec` to run commands inside it.

   ```bash
   docker exec -it <container_name_or_id> npm test
   ```

   Alternatively, if you have configured a specific test command in your `docker-compose.yml`, you can run:

   ```bash
   docker-compose exec app npm test
   ```

6. **Stopping the Containers**:
   When you're done, you can stop the containers with:

   ```bash
   docker-compose down
   ```

   This command will stop and remove the containers, networks, and volumes created by Docker Compose.

### Optional: **Rebuild Without Cache**

If you need to rebuild the Docker images without using the cache (for example, if dependencies have changed), use:

```bash
docker-compose build --no-cache
```

---
