# 🚀 Deploy PrithviLok to Render - Quick Start

## ⚡ TL;DR - Deploy in 5 Minutes

### What You Have
✅ GitHub repo: `https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK.git`  
✅ `render.yaml` configured for backend + frontend  
✅ All code ready to deploy  

---

## 📝 Step-by-Step Instructions

### 1️⃣ Get Required API Keys (5 min)

**MongoDB Atlas** (Required):
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Create database user with password
4. Whitelist IP: `0.0.0.0/0`
5. Copy connection string
6. **Save as**: `MONGO_URI`

**Gmail App Password** (Required for email):
1. Enable 2FA on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password
4. **Save as**: `EMAIL_USER` (your email) and `EMAIL_PASS` (app password)

**Other APIs** (Optional - can add later):
- OpenWeather API: https://openweathermap.org/api → `OPENWEATHER_API_KEY`
- OpenAQ API: https://openaq.org → `OPENAQ_API_KEY`
- Hugging Face: https://huggingface.co/settings/tokens → `HF_TOKEN`
- Google Gemini: https://makersuite.google.com/app/apikey → `GEMINI_API_KEY`
- Google OAuth: https://console.cloud.google.com/apis/credentials → `GOOGLE_CLIENT_ID`

---

### 2️⃣ Deploy to Render (2 min)

1. **Go to Render Blueprint Setup**:
   ```
   https://dashboard.render.com/select-repo?type=blueprint
   ```

2. **Connect GitHub**:
   - Click "Connect GitHub"
   - Authorize Render access
   - Select repo: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`

3. **Render Auto-Detects**:
   - Backend service: `nit-final-prithivlok-1`
   - Frontend service: `nit-final-prithivlok-frontend`

---

### 3️⃣ Configure Environment Variables (3 min)

Click on **Backend Service** → **Environment** tab

Add these variables (click "+ Add Environment Variable"):

| Key | Value | Example |
|-----|-------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/prithvilok` |
| `JWT_SECRET` | Any random string (32+ chars) | `mySuperSecretKey123456789012345678` |
| `EMAIL_USER` | Your Gmail | `you@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` |

**Optional** (add later if needed):
- `OPENWEATHER_API_KEY`
- `OPENAQ_API_KEY`
- `HF_TOKEN`
- `HF_INFERENCE_URL`
- `GEMINI_API_KEY`
- `NFT_CONTRACT_ADDRESS`
- `DEPLOYER_PRIVATE_KEY`
- `GOOGLE_CLIENT_ID`

**Frontend** already configured - no changes needed!

---

### 4️⃣ Click "Apply" (10 min wait)

Render will now:
1. Build backend (~3 min)
2. Build frontend (~5 min)
3. Deploy both services

Watch the progress in the dashboard!

---

### 5️⃣ Test Deployment

**Backend Health Check**:
```
https://nit-final-prithivlok-1.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "🌍 PrithviLok API is running!"
}
```

**Frontend**:
```
https://nit-final-prithivlok-frontend.onrender.com
```

Should load your React app!

---

## ✅ Success Checklist

- [ ] Both services show **"Live"** status
- [ ] Backend health endpoint responds
- [ ] Frontend loads successfully
- [ ] Can register/login
- [ ] No errors in logs

---

## 🔧 Common Issues & Fixes

### ❌ MongoDB Connection Failed
**Fix**: Check connection string format
- Encode special chars in password
- Include database name: `/prithvilok` at end
- Verify IP whitelist includes `0.0.0.0/0`

### ❌ CORS Errors
**Fix**: Ensure `CLIENT_URL` matches exactly
- Should be: `https://nit-final-prithivlok-frontend.onrender.com`
- No trailing slash

### ❌ Email Not Working
**Fix**: Use Gmail App Password
- NOT your regular Gmail password
- Must enable 2FA first
- 16-character app password from Google

### ❌ Service Sleeping (Free Tier)
**Normal**: Free tier services sleep after 15 min inactivity
**Fix**: Upgrade to paid plan ($7/mo) or use uptime monitoring

---

## 📚 Detailed Guides

For more help, see:
- [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) - Complete checklist
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - Full deployment guide
- [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md) - Quick reference
- [`MONGODB_SETUP.md`](./MONGODB_SETUP.md) - MongoDB detailed setup

---

## 🎯 Your URLs After Deployment

**Backend API**: `https://nit-final-prithivlok-1.onrender.com`  
**Frontend**: `https://nit-final-prithivlok-frontend.onrender.com`  
**Health Check**: `https://nit-final-prithivlok-1.onrender.com/api/health`

---

## 💰 Cost Estimate

**Free Tier**:
- Backend: 750 hours/month (enough for 1 instance)
- Frontend: Unlimited (static site)
- Bandwidth: 100GB/month included

**Paid** (optional):
- Backend: $7/month (prevents sleep)
- Total: ~$7/month

---

## 🆘 Need Help?

1. Check Render logs in dashboard
2. Review error messages
3. Verify environment variables
4. Test locally first if possible

**Resources**:
- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Your GitHub: https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK

---

## 🎉 Ready to Deploy!

Just follow steps 1-5 above and you'll be live in ~15 minutes!

**Good luck! 🚀**
