# ⚡ Quick Deploy - Single URL Setup

## 🎯 Your Configuration

**Single Unified Service**: Frontend + Backend on ONE URL

---

## 📦 What's Ready

✅ Code pushed to GitHub  
✅ `render.yaml` configured for single service  
✅ Frontend builds automatically  
✅ Backend serves both frontend and API  
✅ Root 404 error fixed  

---

## 🚀 Deploy Now (3 Steps)

### 1️⃣ Click This Link
```
https://dashboard.render.com/select-repo?type=blueprint
```

### 2️⃣ Select Your Repo
- Choose: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`
- Render auto-detects configuration

### 3️⃣ Add Environment Variables

**Required** (must add):
```env
MONGO_URI=mongodb+srv://your-mongo-uri
JWT_SECRET=your-random-32-char-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=gmail-app-password
```

**Optional** (add later):
```env
OPENWEATHER_API_KEY=...
OPENAQ_API_KEY=...
HF_TOKEN=...
GEMINI_API_KEY=...
NFT_CONTRACT_ADDRESS=...
DEPLOYER_PRIVATE_KEY=...
GOOGLE_CLIENT_ID=...
```

### 4️⃣ Click "Apply" ✅

---

## 🎉 After Deployment

Your **single URL** will be:
```
https://nit-final-prithivlok.onrender.com
```

### What Works Where:

| Feature | URL |
|---------|-----|
| **Frontend App** | `https://nit-final-prithivlok.onrender.com/` |
| **Health Check** | `https://nit-final-prithivlok.onrender.com/api/health` |
| **All API Routes** | `https://nit-final-prithivlok.onrender.com/api/*` |
| **Uploads** | `https://nit-final-prithivlok.onrender.com/uploads/*` |

---

## ✅ Test Checklist

After deployment completes (~10 min):

- [ ] Visit main URL → Frontend loads
- [ ] Visit `/api/health` → Shows health status
- [ ] Try login/register → Works
- [ ] Navigate pages → No errors
- [ ] Check browser console → No CORS errors ✨

---

## 💰 Cost

**FREE TIER**: $0/month
- 1 web service (750 hours free)
- 100GB bandwidth included

---

## 🔧 Build Process

Render executes:
```bash
npm install                              # Backend deps
cd ../frontend_old                       # Go to frontend
npm install                              # Frontend deps
npm run build                            # Build React app
cd ../backend                            # Back to backend
node server.js                           # Start unified server
```

Result: **One server serving everything!**

---

## 🆘 Common Issues

**Build Fails?**
- Check both package.json files exist
- Verify Node.js version compatibility

**Frontend shows but API doesn't work?**
- Add required environment variables
- Check MongoDB connection

**CORS errors?**
- Won't happen with single URL setup! ✅

---

## 📞 Support Links

- Full Guide: [`SINGLE_URL_DEPLOYMENT.md`](./SINGLE_URL_DEPLOYMENT.md)
- MongoDB Setup: [`MONGODB_SETUP.md`](./MONGODB_SETUP.md)
- Render Docs: https://render.com/docs

---

**Ready?** Just click the link in step 1 and follow the process! 🚀

Deployment time: ~10 minutes  
Complexity: ⭐ Easy  
