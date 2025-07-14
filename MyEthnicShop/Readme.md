# MyEthnicShop

A full-stack e-commerce platform for ethnic products, featuring a modern React frontend and a robust Node.js/Express/MongoDB backend. The project supports user and admin roles, product management, cart, wishlist, order processing, reviews, payments, and more.

---

## Features

- **User Authentication & Authorization:**
  - Register, login (JWT, bcrypt)
  - Role-based access (admin/user)
- **Product Management:**
  - CRUD operations (admin)
  - Product search, filter, pagination
  - Image upload (Cloudinary)
- **Cart & Wishlist:**
  - Add, update, remove items
  - View current cart and wishlist
- **Order & Checkout:**
  - Place orders from cart
  - View user and admin orders
  - Update order status (admin)
- **Product Reviews & Ratings:**
  - Add/view reviews and ratings
  - Average rating and review count
- **Payment Integration:**
  - Secure online payments (Razorpay)
- **Admin Features:**
  - Manage products, users, orders
  - Analytics dashboard
- **Infrastructure:**
  - MongoDB Atlas, Cloudinary, environment variable management, error handling, clean code structure

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Cloudinary, Multer, Razorpay, Nodemailer, etc.
- **Frontend:** React, React Router, Axios, Framer Motion, Keen Slider, Razorpay, etc.

---

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd MyEthnicShop/backend
   npm install
   ```
2. **Environment Variables:**
   Create a `.env` file in the backend root with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
3. **Run the server:**
   ```bash
   npm start
   ```
   The server runs on `http://localhost:5000` by default.

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd MyEthnicShop/frontend
   npm install
   ```
2. **Run the app:**
   ```bash
   npm start
   ```
   The app runs on `http://localhost:3000` by default.

---

## Folder Structure

- `MyEthnicShop/backend/` - Express backend (API, models, controllers, routes, etc.)
- `MyEthnicShop/frontend/` - React frontend (components, pages, context, etc.)

---

## Scripts

- **Backend:** `npm start` (start server)
- **Frontend:** `npm start` (start React app), `npm run build` (production build)

---

## License

This project is licensed under the ISC License.
