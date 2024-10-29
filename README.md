# PDFUploader

## Overview

PDFUploader is a web application that allows users to upload, manage, and rearrange PDF files. The application supports features like user authentication, PDF uploading, viewing, and reordering pages. It uses Node.js, Express, and TypeScript for the backend, and Vite with React for the frontend.

## Live Demo

Visit the live application: [https://pdf-uploader-psi.vercel.app/](https://pdf-uploader-psi.vercel.app/)

## Repository

The source code is available on GitHub: [https://github.com/HishamPH/pdf-uploader](https://github.com/HishamPH/pdf-uploader)

## Features

### 1. User Authentication

- Register with email and password
- Login functionality
- Password reset option

### 2. PDF Management

- Upload PDFs with file names
- View uploaded PDFs with previews and download options
- Delete uploaded PDFs

### 3. PDF Rearrangement

- Drag-and-drop functionality to rearrange selected pages of a PDF
- Save the new order of rearranged pages

## Technologies Used

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, Vite
- **Database:** MongoDB
- **Deployment:** Vercel, AWS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud instance)

### Installation and Configuration

To set up the application, follow these commands:

# Step 1: Clone the Repository

git clone https://github.com/your-username/pdf-uploader.git

# Step 2: Navigate into the Project Folder

cd pdf-uploader

# Step 3: Backend Setup

## Navigate to the Backend Folder

cd backend

## Install Dependencies

npm install

## Set Up the Backend Environment Variables

mv .env.example .env
echo "PORT=3000" >> .env
echo "MONGO_URL=<your-mongodb-uri>" >> .env
echo "ACCESS_TOKEN_SECRET=<your-access-token-secret>" >> .env
echo "REFRESH_TOKEN_SECRET=<your-refresh-token-secret>" >> .env
echo "BACKEND_URL=http://localhost:3000" >> .env
echo "ORIGIN=http://localhost:5000" >> .env

# Step 4: Frontend Setup

## Navigate to the Frontend Folder

cd ../frontend

## Install Dependencies

npm install

## Set Up the Frontend Environment Variables

mv .env.example .env
echo "VITE_BACKEND=http://localhost:3000" >> .env
