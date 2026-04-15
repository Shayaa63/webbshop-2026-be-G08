# 🌱 Plot Twist API

A RESTful backend for a hyperlocal plant exchange platform where users can register, manage plants, and trade.

Built with: **Node.js · Express · MongoDB · Mongoose · JWT Authentication**

---

# 🛠 Setup & Installation

## 1. Clone & Install

```bash
git clone <repo-url>
npm install
```

---

## 2. Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## 3. Run the server

```bash
npm run dev
```

---

# 🌍 Base URL

**Production API:**

```text id="u8g3na"
https://webbshop-2026-be-g08.vercel.app
```

---

# 🔐 Authentication

This API uses **JWT (JSON Web Tokens)**.

For protected routes, include the token in headers:

```http id="k2v9ld"
Authorization: Bearer <JWT_TOKEN>
```

---

# 👤 Auth Endpoints

| Method | Endpoint         | Description      | Access |
| ------ | ---------------- | ---------------- | ------ |
| POST   | `/auth/register` | Register user    | Public |
| POST   | `/auth/login`    | Login user       | Public |
| GET    | `/auth/me`       | Get current user | User   |
| PUT    | `/auth/me`       | Update user      | User   |
| PATCH  | `/auth/:id/role` | Change user role | Admin  |

---

## 🔑 Login Example

```json id="q8x1aa"
{
  "email": "john@mail.com",
  "password": "123456"
}
```

---

# 🌱 Plant Endpoints

| Method | Endpoint       | Description     | Protected |
| ------ | -------------- | --------------- | --------- |
| GET    | `/plants`      | Get all plants  | No        |
| GET    | `/plants/:id`  | Get plant by ID | No        |
| GET    | `/plants/mine` | Get user plants | Yes       |
| POST   | `/plants`      | Create plant    | Yes       |
| DELETE | `/plants/:id`  | Delete plant    | Yes       |

---

## ➕ Create Plant Example

```json id="b7n2cc"
{
  "name": "Monstera",
  "species": "Deliciosa",
  "description": "Large indoor plant",
  "imageUrl": "https://image.com/plant.jpg",
  "lightLevel": 2,
  "location": {
    "address": "Stockholm"
  }
}
```

---

## ⚠️ Plant Rules

* `name` must match allowed enum values
* `species` is required
* `imageUrl` is required
* `lightLevel` must be `1`, `2`, or `3`
* `email` is case-insensitive (use lowercase for consistency)

---

# 🛡️ Admin Features

Users with role `"admin"` have extended permissions.

### Admin capabilities:

* Delete any plant
* Promote/demote users via role endpoint

---

## Promote User Example

```http id="x9k1zz"
PATCH /auth/USER_ID/role
Content-Type: application/json

{
  "role": "admin"
}
```

---

# 🧱 Data Models (MongoDB)

## 👤 User

```js id="m1p9aa"
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin",
  createdAt,
  updatedAt
}
```

---

## 🌱 Plant

```js id="p8v2bb"
{
  name: String (enum),
  species: String,
  description: String,
  imageUrl: String,
  lightLevel: 1 | 2 | 3,

  location: {
    address: String
  },

  owner: ObjectId → User,
  isAvailable: Boolean
}
```

---

# 📡 API Responses

## Success

```json id="c2n9dd"
{
  "data": "..."
}
```

## Error

```json id="v7m3ee"
{
  "error": "Message"
}
```

---

# 🚨 Status Codes

* `200 / 201` → Success
* `400` → Validation error
* `401` → Unauthorized
* `403` → Forbidden (admin only)
* `404` → Not found
* `500` → Server error

---

# 🧠 Important Notes

* JWT expires after **24h**
* Always include `Authorization` header for protected routes
* Email is case-insensitive → recommended lowercase usage
* Plant `name` must match backend enum exactly

---

# 📂 Project Structure

```text id="t4k8ff"
src/
├── config/
├── middleware/
├── models/
├── routes/
│   ├── auth.js
│   ├── plants.js
│   ├── trades.js
│   └── admin.js
├── app.js
└── server.js
```

---

# 🚀 Frontend Example

## Login request

```js id="k7v3zz"
fetch(`${BASE_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
```

---

## Authenticated request

```js id="a9x2qq"
fetch(`${BASE_URL}/plants`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

# 🌟 Summary

Plot Twist API provides:

* Secure authentication (JWT)
* Plant management (CRUD)
* Role-based access (user/admin)