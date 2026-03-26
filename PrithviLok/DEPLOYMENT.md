# 🚀 PrithviLok Deployment Guide
## Single URL Setup: Frontend (Vercel) + Backend (Render)

This project is configured to run on a **single public URL** using Vercel's proxy capabilities. Even though the backend and frontend are hosted separately, users only ever see the Vercel URL.

---

## 🛠️ Step 1: Local File Configuration

Ensure these files are updated before pushing to GitHub:

### **1. Frontend Production Env (`frontend_old/.env.production`)**
```env
VITE_API_URL=/api
VITE_SOCKET_URL=https://nit-final-prithivlok-5.onrender.com
VITE_GOOGLE_CLIENT_ID=809980942053-ijntbe98snfgf0q6pv34ju2ehl09b1nr.apps.googleusercontent.com
```
> [!IMPORTANT]
> `VITE_API_URL` MUST be `/api` for the Vercel proxy to work.

### **2. Vercel Rewrite Rules (`frontend_old/vercel.json`)**
This file "bridges" your Vercel frontend to your Render backend.
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://nit-final-prithivlok-5.onrender.com/api/:path*" },
    { "source": "/uploads/:path*", "destination": "https://nit-final-prithivlok-5.onrender.com/uploads/:path*" },
    { "source": "/socket.io/:path*", "destination": "https://nit-final-prithivlok-5.onrender.com/socket.io/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🌎 Step 2: Deploy Backend on Render

1.  **Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2.  **New +**: Create a **Web Service** from your GitHub repo.
3.  **Root Directory**: `PrithviLok/backend`
4.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `CLIENT_URL`: `https://nit-final-prithivlok-g8wv.vercel.app` (Your Vercel URL)
    - `MONGO_URI`: (Your Atlas Mongo Link)
    - `JWT_SECRET`: (Any secure string)
    - `GOOGLE_CLIENT_ID`: (Your Google Client ID)
    - (Add other keys like OpenWeather, Email, etc.)

---

## 🎨 Step 3: Deploy Frontend on Vercel

1.  **Dashboard**: [vercel.com](https://vercel.com)
2.  **Add New**: Create a **Project** from your GitHub repo.
3.  **Root Directory**: `PrithviLok/frontend_old`
4.  **Environment Variables**:
    - `VITE_API_URL`: `/api`
    - `VITE_SOCKET_URL`: `https://nit-final-prithivlok-5.onrender.com`
    - `VITE_GOOGLE_CLIENT_ID`: `809980942053-ijntbe98snfgf0q6pv34ju2ehl09b1nr.apps.googleusercontent.com`

---

## 🔑 Step 4: Google OAuth Setup (Last Step!)

1.  **Dashboard**: [console.cloud.google.com](https://console.cloud.google.com)
2.  **Credentials**: Select your Client ID.
3.  **Authorised JavaScript origins**: Add `https://nit-final-prithivlok-g8wv.vercel.app`
4.  **Authorised redirect URIs**: Add `https://nit-final-prithivlok-g8wv.vercel.app`
5.  **Save** and wait 5 minutes!

---

## 📋 Summary of URLs

| | Link |
|---|---|
| **Public Website** | [https://nit-final-prithivlok-g8wv.vercel.app](https://nit-final-prithivlok-g8wv.vercel.app) |
| **Backend API** | [https://nit-final-prithivlok-5.onrender.com](https://nit-final-prithivlok-5.onrender.com/api/health) |

---

## 🐛 Common Fixes

- **404 on Refresh**: Ensure the `/(.*)` rule is in `vercel.json`.
- **CORS Error**: Check that `CLIENT_URL` on Render exactly matches your Vercel URL.
- **Login Error**: Add your Vercel URL to the Google Cloud Console Authorized Origins.
- **Backend Sleep**: Render Free tier sleeps after 15 minutes of inactivity—it will take a few seconds to "wake up" the first time you visit it.
