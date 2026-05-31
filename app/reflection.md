# Week 4 Frontend Reflection

In this assignment, I created a Next.js frontend for the Book Tracker API.

The frontend connects to the FastAPI backend using the `NEXT_PUBLIC_API_URL` environment variable. This makes the API URL configurable instead of hard-coding it directly into every request.

The page can fetch and display books from the backend, add a new book, view book details, update a book, and delete a book. These actions connect to the backend CRUD routes.

I also added loading and error states so users can see when data is loading or when an API request fails.

This project helped me understand how a frontend application communicates with a backend API and how environment variables, CORS, and API requests work together in a full-stack application.