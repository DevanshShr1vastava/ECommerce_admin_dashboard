# **E-Commerce Admin Dashboard**

## **Overview**
This project is a fully functional **E-Commerce Admin Dashboard** built with **React, Vite, and TypeScript**. It allows admins to manage products, users, orders, carts, blogs, comments, quotes, and recipes using the **DummyJSON API**.

## **Feature Demonstrations**
Following are recorded GIF demonstrations showcasing the features of this admin dashboard. Click on the links below to view the corresponding demonstrations:

- [Dashboard Demo](./Demonstrations/DashboardDemonstration.md)
- [Authentication Demo](./Demonstrations/LoginDemonstration.md)
- [Product Management Demo](./Demonstrations/ProductDemonstrations.md)
- [Cart Management Demo](./Demonstrations/CartDemonstration.md)
- [User Management Demo](./Demonstrations/UsersDemonstrations.md)
- [Order Management Demo](./Demonstrations/OrdersDemonstration.md)
- [Blog & Comments Demo](./Demonstrations/BlogDemonstrations.md)

Click on any link to view the detailed demonstration in the respective README file.


## **Features**

### **1. Authentication**
<div align="left">
  <ul>
    <li>Implemented login functionality using <strong>React Hook Form</strong> for validation.</li>
    <li>Handled failed login attempts with proper error messages.</li>
    <li>Stored authentication tokens using <strong>Zustand</strong>.</li>
  </ul>
</div>

####  Quotes & Recipes
<div align="left">
  <ul>
    <li>Displayed <strong>motivational quotes</strong> (<code>GET /quotes</code>).</li>
    <li>Displayed <strong>recipes</strong> (<code>GET /recipes</code>).</li>
  </ul>
</div>
<img align="right" src="https://github.com/user-attachments/assets/0cc02604-f7fa-443c-b21e-c3843d297788" />

### **2. Product Management**
<div align="left">
  <ul>
    <li>Displayed all products with details (<code>GET /products</code>, <code>GET /products/{id}</code>).</li>
    <li>Implemented <strong>search, filter, and sorting</strong> using <strong>useState</strong> and <strong>useReducer</strong>.</li>
    <li>Enabled add, edit, and delete functionality via API.</li>
    <li>Form validation handled with <strong>React Hook Form</strong>.</li>
    <li>UI built using <strong>Ant Design</strong>.</li>
  </ul>
</div>
<img align="right" src="https://github.com/user-attachments/assets/6d08b830-164c-4fb9-ab94-8b373d072248" />

### **3. Cart Management (Admin Perspective)**
<div align="left">
  <ul>
    <li>Fetched cart data (<code>GET /carts</code>).</li>
    <li>Added and removed items from the cart using API.</li>
    <li>Implemented cart summary with total price calculation.</li>
    <li>Used <strong>Zustand</strong> for global cart state management.</li>
  </ul>
</div>
<img align="right" src="https://github.com/user-attachments/assets/3c53ba7c-6c84-48b1-b67f-c0dd139315fe" />

### **4. User Management**
<div align="left">
  <ul>
    <li>Displayed all users with details (<code>GET /users</code>, <code>GET /users/{id}</code>).</li>
    <li>Implemented <strong>search and filtering</strong>.</li>
    <li>Enabled admin to edit user details.</li>
  </ul>
</div>
<img align="right" src="https://github.com/user-attachments/assets/93d28a55-007d-4ac6-8220-7d2bb4ba69ad" />

### **5. Order Management**
<div align="left">
  <ul>
    <li>Fetched all orders (<code>GET /carts</code>).</li>
    <li>Displayed order details and associated users.</li>
    <li>Implemented <strong>order status update</strong> feature.</li>
  </ul>
</div>

### **6. Blog & Comments Section**
<div align="left">
  <ul>
    <li>Fetched posts (<code>GET /posts</code>) and comments (<code>GET /comments</code>).</li>
    <li>Enabled adding new comments (<code>POST /comments/add</code>).</li>
    <li>Managed user comments globally using <strong>Zustand</strong>.</li>
  </ul>
</div>
<img align="right" src="https://github.com/user-attachments/assets/4ccff95b-2fb8-44b4-8833-fb9d71961c20" />



## **Tech Stack**
- **React + Vite + TypeScript**
- **UI Library**: Ant Design
- **React Query (TanStack Query)** for API calls
- **Axios** for handling HTTP requests
- **React Hook Form** for form validation
- **useState, useReducer** for component state management
- **Zustand** for global state management
- **React Router** for navigation

## **Additional Features**
- Implemented **Dark Mode & Light Mode** using `useContext`.
- Added **pagination** for large datasets.

## **API Endpoints Used**
Refer to [DummyJSON API](https://dummyjson.com/docs) for detailed documentation.

- `POST /auth/login` - User authentication
- `GET /users` - List users
- `GET /users/{id}` - Get user details
- `GET /products` - List products
- `GET /products/{id}` - Get product details
- `POST /carts/add` - Create a new cart (order)
- `GET /carts` - List all carts (orders)
- `GET /carts/{id}` - Get cart details
- `DELETE /carts/{id}` - Cancel an order
- `GET /quotes` - Fetch quotes
- `GET /recipes` - Fetch recipes
- `GET /posts` - Fetch posts
- `GET /comments` - Fetch comments
- `POST /comments/add` - Add a comment


