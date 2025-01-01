# E-commerce Demo Backend

This repository contains the backend server for the e-commerce demo application.

## Prerequisites

- Node.js
- Yarn package manager
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paingpyaethu/ecomm-demo-backend
   ```
2. Switch to the latest branch:
   ```bash
   git checkout dev
   ```
3. Remove Git history:
   ```bash
   rm -rf .git
   ```
4. Install dependencies:
   ```bash
   yarn install
   ```

## Configuration

1. Create a `.env` file in the root directory
2. Add the following environment variables:

   ```env
   API_URL=/api/demo-ecomm/v1
   HOST=192.168.8.100
   PORT=8000
   ACCESS_TOKEN_SECRET=VOz5UtGeqxzm9wDbxZ2YHpOAzDGSM6
   DATABASE_URL="file:./dev.db"
   ```

   **Important Notes:**
   - `ACCESS_TOKEN_SECRET` should be complex and hard to guess
   - `HOST` must be your WiFi or internet connection IP address to connect with the mobile app

## Database Setup

1. Run migrations to create the database:
   ```bash
   yarn migrate
   ```
   This will create `dev.db` in the prisma folder.

2. Start the server:
   ```bash
   yarn dev
   ```
   You should see: 🚀 ~ Server is running on http://[HOST]:8000

## File Upload Configuration

If you plan to use the file uploading feature:
1. Create a nested folder structure in the src directory:
   ```
   src/uploads/images
   ```

## Database Management

To inspect and manage your database:
- Run `npx prisma studio`
- If using Android emulator, run on a different port:
  ```bash
   npx prisma studio --port 5556
   ```
   Note: This is necessary because Android emulator and Prisma Studio use the same default port.

## Success! 🎉

Your backend server should now be up and running successfully.
