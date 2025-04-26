// src/routes/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl mb-4">404 – Page Not Found</h1>
      <p className="mb-6">Sorry, that page doesn’t exist.</p>
      <Link to="/" className="text-blue-600 underline">
        Go back home
      </Link>
    </div>
  )
}
