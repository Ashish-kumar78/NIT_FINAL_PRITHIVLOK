# 🚀 Single URL Deployment Guide - PrithviLok

## ✅ What's Changed

Your project is now configured to deploy **both frontend and backend on a SINGLE URL**!

### Before:
- Backend: `https://nit-final-prithivlok-1.onrender.com`
- Frontend: `https://nit-final-prithivlok-frontend.onrender.com`
- **2 separate URLs** ❌

### After:
- **Single URL**: `https://nit-final-prithivlok.onrender.com`
  - Frontend: `https://nit-final-prithivlok.onrender.com/`
  - Backend API: `https://nit-final-prithivlok.onrender.com/api/*`
  - **1 unified URL** ✅

---

## 🔧 Technical Changes Made

### 1. Updated `server.js`
- Added path imports for serving static files
- In production: Serves frontend from `../frontend_old/dist`
- In development: Shows API info endpoint
- React Router support: All non-API routes serve `index.html`

### 2. Updated `render.yaml`
- Removed separate frontend service
- Unified build command: `npm install && cd ../frontend_old && npm install && npm run build`
- Single service: `nit-final-prithivlok`
- Updated CLIENT_URL to match new single URL

### 3. Build Process
```bash
# Render will execute:
npm install                          # Install backend dependencies
cd ../frontend_old                   # Go to frontend folder
npm install                          # Install frontend dependencies  
npm run build                        # Build frontend (Vite)
# Returns to backend and starts server
node server.js                       # Start backend (serves both)
```

---

## 📋 Deployment Steps

### Step 1: Push Code to GitHub ✅
Already done! Your code is pushed to:
```
https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK.git
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/select-repo?type=blueprint

2. **Connect Repository**:
   - Select: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`
   - Render detects the updated `render.yaml`

3. **Configure Service**:
   - Name: `nit-final-prithivlok`
   - Region: Choose closest to you
   - Branch: `main`

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

| Key | Value | Required? |
|-----|-------|-----------|
| `MONGO_URI` | Your MongoDB connection string | ✅ Required |
| `JWT_SECRET` | Random secure string (32+ chars) | ✅ Required |
| `EMAIL_USER` | Your Gmail address | ✅ Required |
| `EMAIL_PASS` | Gmail app password | ✅ Required |
| `OPENWEATHER_API_KEY` | OpenWeather API key | Optional |
| `OPENAQ_API_KEY` | OpenAQ API key | Optional |
| `HF_TOKEN` | Hugging Face token | Optional |
| `HF_INFERENCE_URL` | Hugging Face model URL | Optional |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |
| `NFT_CONTRACT_ADDRESS` | NFT contract address | Optional |
| `DEPLOYER_PRIVATE_KEY` | Wallet private key | Optional |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional |

5. **Click "Apply"**

### Step 3: Wait for Deployment (~10 minutes)

Render will:
1. Build backend dependencies (~2 min)
2. Build frontend (~3 min)
3. Start unified server (~1 min)
4. Show "Live" status ✅

---

## ✅ Testing Your Deployment

### 1. Test Frontend
Visit: `https://nit-final-prithivlok.onrender.com`

Expected: React app loads successfully

### 2. Test Backend API
Visit: `https://nit-final-prithivlok.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "message": "🌍 PrithviLok API is running!"
}
```

### 3. Test Root Endpoint
Visit: `https://nit-final-prithivlok.onrender.com`

In development mode, shows API info.  
In production mode, serves frontend app.

### 4. Test API Endpoints
All these should work:
- `/api/auth/register`
- `/api/users/profile`
- `/api/dustbins`
- `/api/environment`
- etc.

---

## 🎯 URL Structure

After deployment, your single URL will handle:

| Path | Serves |
|------|--------|
| `/` | Frontend React App |
| `/login` | Frontend Login Page |
| `/dashboard` | Frontend Dashboard |
| `/api/health` | Backend Health Check |
| `/api/auth/*` | Backend Auth Routes |
| `/api/users/*` | Backend User Routes |
| `/uploads/*` | Uploaded Files |

---

## 💡 Benefits of Single URL

✅ **Simpler Architecture**: One service to manage  
✅ **No CORS Issues**: Frontend and backend same origin  
✅ **Cost Effective**: Only pay for one service (free tier = 1 service)  
✅ **Easier Configuration**: One set of environment variables  
✅ **Better Performance**: No cross-origin requests  
✅ **Cleaner URLs**: Share one domain with users  

---

## 🔍 Troubleshooting

### Issue: "Cannot GET /" or 404 on root
**Solution**: 
- Ensure frontend built successfully
- Check `dist` folder exists in `frontend_old`
- Verify `NODE_ENV=production` in Render

### Issue: API calls return 404
**Solution**:
- Make sure API calls start with `/api`
- Check backend routes are mounted at `/api/*`
- Verify build command ran successfully

### Issue: Frontend shows but API doesn't work
**Solution**:
- Check all environment variables are set
- Verify MongoDB connection string is correct
- Look at Render logs for errors

### Issue: Build fails
**Solution**:
- Check both backend and frontend package.json exist
- Verify Node.js version compatibility
- Review build logs in Render dashboard

---

## 📊 Expected Render Dashboard View

```
Service: nit-final-prithivlok
Status: ● Live
URL: https://nit-final-prithivlok.onrender.com

Build Command: npm install && cd ../frontend_old && npm install && npm run build
Start Command: node server.js

Environment Variables:
✓ NODE_ENV = production
✓ PORT = 10000
✓ MONGO_URI = ***
✓ JWT_SECRET = ***
... (rest of your variables)
```

---

## 🎉 Success Indicators

You'll know it's working when:

- [x] Service shows **"Live"** status in Render
- [x] Visiting your URL shows the React app
- [x] Can navigate between pages
- [x] Login/Register works
- [x] API calls succeed (check browser DevTools)
- [x] No CORS errors in console
- [x] WebSocket connects successfully

---

## 💰 Cost Breakdown

**Free Tier**:
- 1 Web Service: 750 hours/month (FREE)
- Bandwidth: 100GB/month (FREE)
- Storage: Shared (FREE)

**Total Cost**: $0/month (Free tier) ✨

---

## 🔗 Quick Links

- **Your Single URL**: `https://nit-final-prithivlok.onrender.com`
- **Health Check**: `https://nit-final-prithivlok.onrender.com/api/health`
- **GitHub Repo**: `https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK`
- **Render Dashboard**: `https://dashboard.render.com`

---

## 🆘 Need Help?

1. Check Render logs in dashboard
2. Verify all environment variables are set
3. Test locally first: `node server.js` then visit `http://localhost:5000`
4. Review the build output in Render

---

**Ready to deploy?** Just follow the steps above and you'll have your single URL live in ~10 minutes! 🚀
