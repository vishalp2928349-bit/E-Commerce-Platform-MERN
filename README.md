# MERN E-Commerce Platform

A full-stack e-commerce application built with MongoDB, Express, React (Vite), and Node.js.

## Features

**Customer:** browse/search/filter/sort products, product details with reviews, wishlist, cart with coupon codes, checkout (Cash on Delivery — no payment gateway), order history, profile management.

**Admin:** dashboard stats, product CRUD with Cloudinary image upload, category management, order status management, customer management, coupon management.

## Tech Stack

- **Frontend:** React (Vite), React Router DOM, Redux Toolkit, Axios, Tailwind CSS, React Hook Form
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Multer, Cloudinary, express-validator

> This build has no payment gateway — checkout collects a shipping address and places the order directly as "Cash on Delivery". Want Stripe added back later? Just ask.

## Project Structure

```
mern-ecommerce/
├── client/    # React frontend (Vite)
└── server/    # Express backend API
```

## Getting Started

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary + Stripe keys
npm run dev
```
Runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL and Stripe publishable key
npm run dev
```
Runs on `http://localhost:5173`.

### 3. Create your first admin user

Register a normal account via the app, then manually set that user's `role` field to `"admin"` in MongoDB Atlas (Compass or the Atlas web UI). All `/admin` routes require this role.

## Environment Variables

See `server/.env.example` and `client/.env.example` for the full list. You'll need:
- A MongoDB Atlas cluster + connection string
- A Cloudinary account (cloud name, API key, API secret)

## API Overview

All endpoints are prefixed with `/api`. Key resources: `/auth`, `/products`, `/categories`, `/cart`, `/wishlist`, `/orders`, `/reviews`, `/coupons`, `/upload`, `/users`, `/payment`.

## Deployment

- **Frontend:** Vercel (set `VITE_API_URL` to your deployed backend URL)
- **Backend:** Render (set all env vars from `.env.example` in the Render dashboard; set `CLIENT_URL` to your deployed frontend URL)
- **Database:** MongoDB Atlas (whitelist Render's IP or allow access from anywhere)

## Notes

- Product reviews are embedded in the Product document rather than a separate collection — simpler queries, same functionality as the spec's "Review" feature.
- Orders are placed as "Cash on Delivery" with `paymentStatus: pending`. Admins can update `orderStatus` from the admin panel as orders are fulfilled.
# E-Commerce-Platform-MERN
