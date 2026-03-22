# ✅ Render Deployment Checklist - PrithviLok

Use this checklist to ensure successful deployment to Render.

---

## 📋 Pre-Deployment Preparation

### 1. GitHub Repository
- [x] Code pushed to GitHub: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`
- [x] `render.yaml` exists in root directory
- [x] All files committed and pushed

### 2. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account at https://mongodb.com/cloud/atlas
- [ ] Create M0 Free cluster (US East recommended)
- [ ] Create database user with password
- [ ] Whitelist IP: `0.0.0.0/0` (for testing)
- [ ] Get connection string
- [ ] URL-encode password if needed
- [ ] Test connection string locally

### 3. Email Configuration (Gmail)
- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password: https://myaccount.google.com/apppasswords
- [ ] Save the 16-character app password

### 4. API Keys Collection

#### OpenWeather API
- [ ] Sign up at https://openweathermap.org/api
- [ ] Get free API key
- [ ] Copy API key

#### OpenAQ API
- [ ] Sign up at https://openaq.org
- [ ] Get API key
- [ ] Copy API key

#### Hugging Face
- [ ] Create account at https://huggingface.co
- [ ] Go to Settings → Tokens
- [ ] Create new token (read access)
- [ ] Copy token

#### Google Gemini
- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Create API key
- [ ] Copy API key

#### Google OAuth
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create new project (or select existing)
- [ ] Create OAuth 2.0 Client ID
- [ ] Configure consent screen
- [ ] Copy Client ID

### 5. NFT Contract (Optional for initial deploy)
- [ ] Deploy EcoNFT.sol to Polygon Mumbai testnet
- [ ] Copy contract address
- [ ] Note deployer wallet private key

---

## 🚀 Deployment Steps

### Step 1: Access Render
- [ ] Go to https://dashboard.render.com
- [ ] Sign up/login to Render account

### Step 2: Create Blueprint
- [ ] Click **"New +"** → **"Blueprint"**
- [ ] Connect GitHub account (if not already connected)
- [ ] Select repository: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`
- [ ] Render detects `render.yaml`

### Step 3: Configure Backend Service

Click on `nit-final-prithivlok-1` service:

- [ ] Go to **Environment** tab
- [ ] Add environment variables:

| Variable | Value | Status |
|----------|-------|--------|
| `MONGO_URI` | Your MongoDB connection string | ☐ |
| `JWT_SECRET` | Random secure string (32+ chars) | ☐ |
| `EMAIL_USER` | Your Gmail address | ☐ |
| `EMAIL_PASS` | Gmail app password | ☐ |
| `OPENWEATHER_API_KEY` | OpenWeather API key | ☐ |
| `OPENAQ_API_KEY` | OpenAQ API key | ☐ |
| `HF_TOKEN` | Hugging Face token | ☐ |
| `HF_INFERENCE_URL` | Hugging Face model URL | ☐ |
| `GEMINI_API_KEY` | Google Gemini API key | ☐ |
| `NFT_CONTRACT_ADDRESS` | NFT contract address (optional) | ☐ |
| `DEPLOYER_PRIVATE_KEY` | Wallet private key (optional) | ☐ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ☐ |

### Step 4: Verify Frontend Service

Click on `nit-final-prithivlok-frontend` service:

- [ ] Environment variables already set in render.yaml
- [ ] No changes needed (unless customizing)

### Step 5: Deploy
- [ ] Review all settings
- [ ] Click **"Apply"** button
- [ ] Wait for deployment to start

---

## ⏳ During Deployment

### Monitor Progress (10-15 minutes)

#### Backend (3-5 minutes)
- [ ] Build started
- [ ] Dependencies installing
- [ ] Build completed
- [ ] Service starting
- [ ] **Status: Live** ✅

#### Frontend (5-7 minutes)
- [ ] Build started
- [ ] npm install running
- [ ] Vite build running
- [ ] Static site deployed
- [ ] **Status: Live** ✅

### Check Logs

#### Backend Logs
- [ ] No errors in logs
- [ ] See "PrithviLok Server running" message
- [ ] MongoDB connection successful

#### Frontend Logs
- [ ] Build successful
- [ ] No critical warnings
- [ ] Deployed successfully

---

## ✅ Post-Deployment Verification

### Test Backend
- [ ] Visit: `https://nit-final-prithivlok-1.onrender.com/api/health`
- [ ] Expected response: `{"status": "ok", "message": "🌍 PrithviLok API is running!"}`
- [ ] Test other endpoints (optional):
  - [ ] `/api/auth/register`
  - [ ] `/api/users/profile`
  - [ ] `/api/dustbins`

### Test Frontend
- [ ] Visit: `https://nit-final-prithivlok-frontend.onrender.com`
- [ ] Page loads without errors
- [ ] Can navigate between pages
- [ ] Login/Register forms work
- [ ] API calls successful (check browser console)

### Test WebSocket Connection
- [ ] Open browser DevTools → Network
- [ ] Look for WebSocket connection
- [ ] Status should be "Connected"

### Test Database Operations
- [ ] Try registering a new user
- [ ] Check MongoDB Atlas → Collections
- [ ] Verify data is saved

---

## 🐛 Troubleshooting Common Issues

### Issue: Backend Build Fails
**Symptoms**: Red "Failed" status
**Solutions**:
- [ ] Check build logs for specific error
- [ ] Verify all dependencies in package.json
- [ ] Ensure Node.js version compatibility
- [ ] Check for syntax errors in code

### Issue: MongoDB Connection Error
**Symptoms**: "Authentication failed" or timeout
**Solutions**:
- [ ] Verify MONGO_URI is correct
- [ ] Check password is URL-encoded
- [ ] Confirm IP whitelist includes 0.0.0.0/0
- [ ] Test connection string in MongoDB Compass

### Issue: CORS Errors
**Symptoms**: Frontend can't call backend
**Solutions**:
- [ ] Verify CLIENT_URL matches frontend URL exactly
- [ ] Check for trailing slashes
- [ ] Clear browser cache
- [ ] Restart backend service

### Issue: Email Not Sending
**Symptoms**: OTP emails not received
**Solutions**:
- [ ] Use Gmail App Password, not regular password
- [ ] Check EMAIL_HOST = smtp.gmail.com
- [ ] Check EMAIL_PORT = 587
- [ ] Verify 2FA is enabled on Gmail

### Issue: Service Keeps Crashing
**Symptoms**: Repeated restarts
**Solutions**:
- [ ] Check logs for error messages
- [ ] Verify all required env vars are set
- [ ] Check memory usage (free tier limit: 512MB)
- [ ] Look for infinite loops or memory leaks

### Issue: Frontend Shows Blank Page
**Symptoms**: White screen, no content
**Solutions**:
- [ ] Check browser console for errors
- [ ] Verify VITE_API_URL is correct
- [ ] Check network tab for failed requests
- [ ] Clear cache and hard refresh (Ctrl+Shift+R)

---

## 📊 Success Indicators

All of these should be true:

- [x] Both services show **"Live"** status in Render
- [ ] Health endpoint responds correctly
- [ ] Frontend loads successfully
- [ ] User registration works
- [ ] Login works
- [ ] API endpoints respond
- [ ] WebSocket connects
- [ ] No errors in Render logs
- [ ] MongoDB has user data

---

## 🔗 Important URLs

After deployment, your URLs will be:

**Backend API**: 
```
https://nit-final-prithivlok-1.onrender.com
```

**Frontend**: 
```
https://nit-final-prithivlok-frontend.onrender.com
```

**API Health Check**: 
```
https://nit-final-prithivlok-1.onrender.com/api/health
```

**WebSocket**: 
```
https://nit-final-prithivlok-1.onrender.com
```

---

## 📞 Support Resources

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **Render Community**: https://community.render.com
- **GitHub Repo**: https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK

---

## 🎉 Deployment Complete!

Once all checkboxes are ticked:

✅ Services are live  
✅ Tests passing  
✅ No critical errors  
✅ Users can register/login  

**Congratulations! Your PrithviLok platform is now deployed! 🚀**

---

**Next Steps**:
1. Share the frontend URL with users
2. Monitor logs regularly
3. Set up uptime monitoring (optional)
4. Consider upgrading Render plan to prevent sleep
5. Deploy NFT contract when ready
