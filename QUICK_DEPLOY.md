# PrithviLok Deployment Quick Reference

## 🚀 Quick Deploy Steps

### 1. Verify Git Repository
```bash
# Check current status
git status

# Add all changes
git add .

# Commit
git commit -m "Deployment ready"

# Push to GitHub
git push origin main
```

### 2. Render Deployment URL
Go to: https://dashboard.render.com/select-repo?type=blueprint

Select repository: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`

### 3. Required Environment Variables

Copy this list and fill in your values when deploying:

```env
# Backend Environment Variables (nit-final-prithivlok-1)
MONGO_URI=mongodb+srv://your-mongo-uri
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
OPENWEATHER_API_KEY=your-openweather-api-key
OPENAQ_API_KEY=your-openaq-api-key
HF_TOKEN=your-huggingface-token
HF_INFERENCE_URL=https://api-inference.huggingface.co/models/your-model
GEMINI_API_KEY=your-gemini-api-key
NFT_CONTRACT_ADDRESS=0x-your-nft-contract-address
DEPLOYER_PRIVATE_KEY=0x-your-wallet-private-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id

# These are already set in render.yaml:
# NODE_ENV=production
# PORT=10000
# JWT_EXPIRE=7d
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# CLIENT_URL=https://nit-final-prithivlok-frontend.onrender.com
# POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 4. After Deployment

**Backend URL**: https://nit-final-prithivlok-1.onrender.com
**Frontend URL**: https://nit-final-prithivlok-frontend.onrender.com

Test: 
- Backend Health: https://nit-final-prithivlok-1.onrender.com/api/health
- Frontend: https://nit-final-prithivlok-frontend.onrender.com

---

## 📝 Important Notes

1. **MongoDB Setup**: Create a free MongoDB Atlas account first
   - Go to https://www.mongodb.com/cloud/atlas
   - Create cluster → Get connection string
   - Whitelist IP: 0.0.0.0/0 (for testing)

2. **Email Setup** (Gmail):
   - Enable 2FA on Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use that 16-character password for EMAIL_PASS

3. **API Keys to Get**:
   - OpenWeather: https://openweathermap.org/api
   - OpenAQ: https://openaq.org
   - Hugging Face: https://huggingface.co/settings/tokens
   - Google Gemini: https://makersuite.google.com/app/apikey
   - Google OAuth: https://console.cloud.google.com/apis/credentials

4. **NFT Contract** (Optional for initial deploy):
   - You can deploy without NFT contract initially
   - Add contract address later in environment variables

---

## ⚡ One-Click Deploy

Render will auto-deploy when you connect the repo through their Blueprint feature.

Just make sure:
✅ render.yaml is in root directory (✓ Already exists)
✅ All code is pushed to GitHub
✅ Environment variables are configured
✅ MongoDB Atlas is set up and accessible

---

## 🎯 Expected Deployment Time

- Backend: ~3-5 minutes
- Frontend: ~5-7 minutes
- Total: ~10 minutes

Monitor progress in Render dashboard!
