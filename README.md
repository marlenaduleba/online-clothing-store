# Online Clothing Store API

## Content

- [Description](#description)
- [Technical Requirements](#technical-requirements)
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

## Base URL

`http://localhost:3000`

## API Endpoints

### Authentication

<details>
   <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/register</code>&nbsp;&nbsp;<strong>- User Registration</strong></summary>

- **Description**: This endpoint registers a new user with the provided details. The role is automatically assigned as `user` and cannot be specified during registration.
- **Endpoint**: `/api/v1/register`
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
  curl -X POST '{base_url}/api/v1/register' \
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
   <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/login</code>&nbsp;&nbsp;<strong>- User Login</strong></summary>

- **Description**: This endpoint authenticates a user and returns a JWT token if the credentials are valid. The token can be used to access protected routes and resources.
- **Endpoint**: `/api/v1/login`
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
  curl -X POST '{base_url}/api/v1/login' \
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
    "refreshToken": "741012fe4f41d2f43ebab8b28c4e9..."
  }
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/logout</code>&nbsp;&nbsp;<strong>- User Logout</strong></summary>

- **Description**: This endpoint logs out the user by invalidating their JWT token and refresh token. After successful logout, the token should no longer be accepted for authenticated requests.
- **Endpoint**: `/api/v1/logout`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token to be invalidated.
- **Request Body**:
  ```json
  {
    "refreshToken": "string" // Optional but recommended for complete logout
  }
  ```
- **Response**:
  - `200 OK` with an empty response indicating successful logout
  - `401 Unauthorized` if the token is invalid or missing
  - `400 Bad Request` if the refresh token is missing but required for complete logout
- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/logout' \
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
  <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/refresh</code>&nbsp;&nbsp;<strong>- Refresh Token</strong></summary>

- **Description**: This endpoint refreshes the JWT token using a valid refresh token.
- **Endpoint**: `/api/v1/refresh`
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
  curl -X POST '{base_url}/api/v1/refresh' \
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
  <summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/account</code>&nbsp;&nbsp;<strong>- Get Current User</strong></summary>
  
- **Description**: This endpoint retrieves the details of the currently logged-in user.
- **Endpoint**: `/api/v1/account`
- **Method**: `GET`
- **Response**:
  - `200 OK` with currently logged user's details
  - `401 Unauthorized` on invalid credentials
    
- **Example Request**:

```sh
curl '{base_url}/api/v1/account' \
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
<summary>&nbsp;&nbsp;<img alt="Static Badge"

 src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/admin/products</code>&nbsp;&nbsp;<strong>- Create Product (Admin Only)</strong></summary>

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
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/account/carts</code>&nbsp;&nbsp;<strong>- Add Item to Cart</strong></summary>

- **Description**: Adds an item to the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/account/carts`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can modify their own cart.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "product_id": "string", // The ID of the product to be added to the cart
    "quantity": "integer" // The quantity of the product to be added
  }
  ```
- **Response**:

  - `200 OK` with updated cart details
  - `400 Bad Request` on validation error (e.g., invalid product ID, quantity not a positive integer)
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the specified product does not exist

- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/account/carts' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "1",
    "quantity": 2
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
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
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/account/carts</code>&nbsp;&nbsp;<strong>- Get Current User's Cart</strong></summary>

- **Description**: Retrieves the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user has access to their own cart.
- **Endpoint**: `/api/v1/account/carts`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can access their own cart.
- **Response**:

  - `200 OK` with cart details
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the carts for the current user does not exist

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/account/carts' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 2
      }
    ]
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/PUT-FF8C00" align="center">&nbsp; &nbsp; <code>/api/v1/account/cart</code>&nbsp;&nbsp;<strong>- Update Cart</strong></summary>

- **Description**: Updates the shopping cart of the currently logged-in user. This endpoint allows for updating the quantity of items in the cart, and removing items by setting their quantity to 0. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/account/cart`
- **Method**: `PUT`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can modify their own cart.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product_id": "string", // The ID of the product in the cart
        "quantity": "number" // The updated quantity of the product. Use 0 to remove the product.
      }
    ]
  }
  ```
- **Response**:

  - `200 OK` with updated cart details
  - `400 Bad Request` on validation error (e.g., invalid product ID, quantity not a positive integer)
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the user tries to update a cart that does not belong to them
  - `404 Not Found` if the cart or product does not exist

- **Example Request**:

  ```sh
  curl -X PUT '{base_url}/api/v1/account/cart' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "product_id": "1",
        "quantity": 3
      },
      {
        "product_id": "2",
        "quantity": 0
      }
    ]
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 3,
        "price": 100.0,
        "subtotal": 300.0
      }
    ],
    "total": 300.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:20:00Z"
  }
  ```

</details>
  
<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/account/carts</code>&nbsp;&nbsp;<strong>- Clear Cart</strong></summary>

- **Description**: Clears all items from the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can modify their own cart.
- **Endpoint**: `/api/v1/account/carts`
- **Method**: `DELETE`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can clear their own carts.
- **Response**:

  - `200 OK` with the empty cart details
  - `404 Not Found` if the cart does not exist
  - `401 Unauthorized` if the token is missing or invalid

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/account/carts' \
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
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/POST-0F67B1" align="center">&nbsp;&nbsp;<code>/api/v1/account/orders</code>&nbsp;&nbsp;<strong>- Create Order</strong></summary>

- **Description**: Creates a new order based on the shopping cart of the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can create an order from their own cart.
- **Endpoint**: `/api/v1/account/orders`
- **Method**: `POST`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can create an order from their own cart.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Response**:

  - `201 Created` with order details
  - `400 Bad Request` on validation error (e.g., invalid cart contents)
  - `401 Unauthorized` if the token is missing or invalid
  - `404 Not Found` if the cart is empty or doesn't exist

- **Example Request**:

  ```sh
  curl -X POST '{base_url}/api/v1/account/orders' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 2,
        "price": 100.0,
        "subtotal": 200.0
      }
    ],
    "total": 200.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:00:00Z"
  }
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders</code>&nbsp;&nbsp;<strong>- Get All Orders (Admin Only)</strong></summary>

- **Description**: Retrieves a list of all orders in the system. This endpoint is restricted to administrators only to ensure that order data is protected and only accessible by authorized personnel.
- **Endpoint**: `/api/v1/admin/orders`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. Only users with admin roles or specific permissions should be able to access this endpoint.
- **Response**:
  - `200 OK` with a list of orders
  - `401 Unauthorized` if the user is not authorized or the token is missing/invalid
  - `403 Forbidden` if the authenticated user does not have the necessary admin role or permissions
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
      "items": [
        {
          "product_id": "1",
          "quantity": 2,
          "price": 100.0,
          "subtotal": 200.0
        }
      ],
      "total": 200.0,
      "created_at": "2024-07-16T10:00:00Z",
      "updated_at": "2024-07-16T10:00:00Z"
    },
    {
      "id": "2",
      "user_id": "2",
      "items": [
        {
          "product_id": "2",
          "quantity": 1,
          "price": 150.0,
          "subtotal": 150.0
        }
      ],
      "total": 150.0,
      "created_at": "2024-07-16T11:00:00Z",
      "updated_at": "2024-07-16T11:10:00Z"
    }
  ]
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders/{id}</code>&nbsp;&nbsp;<strong>- Get Order by ID (Admin Only)</strong></summary>

- **Description**: Retrieves the details of a specific order by its ID. This endpoint is accessible only to authenticated users with administrative privileges. It provides detailed information about the order, including items, quantities, and pricing. This endpoint helps administrators to view individual orders for management or support purposes.
- **Endpoint**: `/api/v1/admin/orders/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to retrieve.
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only authenticated administrators can access this endpoint.
- **Response**:

  - `200 OK` with order details. This includes the order's ID, user ID, items (with product ID, quantity, price, and subtotal), total amount, and timestamps for creation and last update.
  - `404 Not Found` if the specified order does not exist in the database.
  - `401 Unauthorized` if the request lacks valid authorization credentials.
  - `403 Forbidden` if the user is not authorized to access this endpoint (e.g., not an admin).

- **Example Request**:

  ```sh
  curl -X GET '{base_url}/api/v1/admin/orders/{id}' \
  -H 'Authorization: Bearer {admin_token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 2,
        "price": 100.0,
        "subtotal": 200.0
      }
    ],
    "total": 200.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:00:00Z"
  }
  ```

</details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/account/orders</code>&nbsp;&nbsp;<strong>- Get Current User's Orders</strong></summary>

- **Description**: Retrieves all orders placed by the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can access their own orders.
- **Endpoint**: `/api/v1/account/orders`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can access their own orders.
- **Response**:

  - `200 OK` with a list of the user's orders
  - `401 Unauthorized` if the token is missing or invalid

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/account/orders' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  [
    {
      "id": "1",
      "user_id": "1",
      "items": [
        {
          "product_id": "1",
          "quantity": 2,
          "price": 100.0,
          "subtotal": 200.0
        }
      ],
      "total": 200.0,
      "created_at": "2024-07-16T10:00:00Z",
      "updated_at": "2024-07-16T10:10:00Z"
    },
    {
      "id": "2",
      "user_id": "1",
      "items": [
        {
          "product_id": "2",
          "quantity": 1,
          "price": 50.0,
          "subtotal": 50.0
        }
      ],
      "total": 50.0,
      "created_at": "2024-07-17T11:00:00Z",
      "updated_at": "2024-07-17T11:10:00Z"
    }
  ]
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/GET-399918" align="center">&nbsp; &nbsp; <code>/api/v1/account/orders/{id}</code>&nbsp;&nbsp;<strong>- Get Current User's Order by ID</strong></summary>

- **Description**: Retrieves details of a specific order placed by the currently logged-in user. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can access their own order details.
- **Endpoint**: `/api/v1/account/orders/{id}`
- **Method**: `GET`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be retrieved.
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can access their own order details.
- **Response**:

  - `200 OK` with details of the specified order
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the user tries to access an order that does not belong to them
  - `404 Not Found` if the order does not exist

- **Example Request**:

  ```sh
  curl '{base_url}/api/v1/account/orders/{id}' \
  -H 'Authorization: Bearer {token}'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 2,
        "price": 100.0,
        "subtotal": 200.0
      }
    ],
    "total": 200.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:10:00Z"
  }
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/PUT-FF8C00" align="center">&nbsp; &nbsp; <code>/api/v1/account/orders/{id}</code>&nbsp;&nbsp;<strong>- Update Order</strong></summary>

- **Description**: Updates an existing order for the currently logged-in user, including the ability to remove a product from the order by setting its quantity to 0. This endpoint is accessible only to authenticated users. The request requires a valid JWT token to ensure that the user can update their own orders.
- **Endpoint**: `/api/v1/account/orders/{id}`
- **Method**: `PUT`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be updated.
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only the authenticated user can update their own order.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product_id": "string", // The ID of the product in the order
        "quantity": "number" // The updated quantity of the product. Use 0 to remove the product.
      }
    ]
  }
  ```
- **Response**:

  - `200 OK` with updated order details
  - `400 Bad Request` on validation error (e.g., invalid product ID, quantity not a positive integer)
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the user tries to update an order that does not belong to them
  - `404 Not Found` if the order does not exist

- **Example Request**:

  ```sh
  curl -X PUT '{base_url}/api/v1/account/orders/{id}' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "product_id": "1",
        "quantity": 3
      },
      {
        "product_id": "2",
        "quantity": 0
      }
    ]
  }'
  ```

- **Example Response**:

  ```json
  {
    "id": "1",
    "user_id": "1",
    "items": [
      {
        "product_id": "1",
        "quantity": 3,
        "price": 100.0,
        "subtotal": 300.0
      }
    ],
    "total": 300.0,
    "created_at": "2024-07-16T10:00:00Z",
    "updated_at": "2024-07-16T10:20:00Z"
  }
  ```

  </details>

<details>
<summary>&nbsp;&nbsp;<img alt="Static Badge" src="https://img.shields.io/badge/DEL-E4003A" align="center">&nbsp; &nbsp; <code>/api/v1/admin/orders/{id}</code>&nbsp;&nbsp;<strong>- Delete Order by ID (Admin Only)</strong></summary>

- **Description**: Deletes an existing order by its ID. This endpoint is accessible only to authenticated users with admin privileges. The request requires a valid JWT token to ensure that the user has the necessary permissions to delete orders.
- **Endpoint**: `/api/v1/admin/orders/{id}`
- **Method**: `DELETE`
- **Path Parameters**:
  - `id` (string, required) - The ID of the order to be deleted.
- **Request Headers**:
  - `Authorization` (string, required) - The JWT token for authorization. This token ensures that only an authenticated admin can delete orders.
  - `Content-Type` (string, required) - Should be `application/json`.
- **Response**:

  - `200 OK` on successful deletion of the order
  - `400 Bad Request` if the order ID is invalid
  - `401 Unauthorized` if the token is missing or invalid
  - `403 Forbidden` if the user does not have admin privileges
  - `404 Not Found` if the order does not exist

- **Example Request**:

  ```sh
  curl -X DELETE '{base_url}/api/v1/admin/orders/{id}' \
  -H 'Authorization: Bearer {admin_token}' \
  -H 'Content-Type: application/json'
  ```

- **Example Response**:

  ```json
  {
    "message": "Order with ID {id} has been successfully deleted."
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

2. **Build the Docker Image**:
   Build the Docker image for the project.

   ```bash
   docker build -t online-clothing-store-api .
   ```

3. **Create and Start Containers**:
   Use Docker Compose to create and start the containers.

   ```bash
   docker-compose up
   ```

4. **Set Up Environment Variables**:
   Ensure your `.env` file is correctly configured, including database connection details and JWT secret.

5. **Access the API**:
   Once the containers are up and running, the API should be accessible at `http://localhost:3000`.

6. **Testing**:
   To run tests, use the appropriate command inside the container.

---
