# 🚀 Render Deployment Guide - PrithviLok

This guide will help you deploy the PrithviLok project to Render using the render.yaml blueprint.

## 📋 Pre-Deployment Checklist

### 1. **Environment Variables Required**

You need to configure the following environment variables in Render (marked as `sync: false` in render.yaml):

#### Backend Service (`nit-final-prithivlok-1`):

| Variable | Description | Example/Format |
|----------|-------------|----------------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/prithvilok` |
| `JWT_SECRET` | Secret key for JWT tokens | Any secure random string (min 32 chars) |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | App password for Gmail | Generate from Google Account settings |
| `OPENWEATHER_API_KEY` | OpenWeather API key | Get from openweathermap.org |
| `OPENAQ_API_KEY` | OpenAQ API key | Get from openaq.org |
| `HF_TOKEN` | Hugging Face token | Get from huggingface.co |
| `HF_INFERENCE_URL` | Hugging Face inference URL | `https://api-inference.huggingface.co/models/...` |
| `GEMINI_API_KEY` | Google Gemini API key | Get from Google AI Studio |
| `NFT_CONTRACT_ADDRESS` | Deployed NFT contract address | `0x...` (after deploying contract) |
| `DEPLOYER_PRIVATE_KEY` | Wallet private key for NFT deployment | `0x...` (keep secure!) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |

#### Frontend Service (`nit-final-prithivlok-frontend`):
- Already configured with backend URLs
- No additional variables needed unless you want to customize

---

## 🎯 Deployment Steps

### Step 1: Push Code to GitHub

Your repository is already set up: `https://github.com/Ashish-kumar78/NIT_FINAL_PRITHIVLOK.git`

Make sure all files are committed and pushed:
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Blueprint

1. **Go to Render Dashboard**: https://dashboard.render.com/

2. **Create New Blueprint**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Select: `Ashish-kumar78/NIT_FINAL_PRITHIVLOK`

3. **Render Will Auto-Detect**:
   - The `render.yaml` file
   - Two services: Backend & Frontend

### Step 3: Configure Environment Variables

In the Render dashboard:

1. **Backend Service Configuration**:
   - Click on `nit-final-prithivlok-1` service
   - Go to **Environment** tab
   - Add all the environment variables listed above
   - For `sync: false` variables, manually enter their values

2. **Frontend Service Configuration**:
   - Click on `nit-final-prithivlok-frontend` service
   - Environment variables are already set in render.yaml
   - No action needed unless customization required

### Step 4: Deploy

1. **Review Services**:
   - Backend: Node.js runtime, port 10000
   - Frontend: Static site, builds with Vite

2. **Click "Apply"**:
   - Render will start building both services
   - Backend will deploy first (~2-3 minutes)
   - Frontend will build after (~3-5 minutes)

3. **Monitor Deployment**:
   - Check logs in Render dashboard
   - Wait for "Live" status

---

## 🔧 Post-Deployment Configuration

### 1. Update Frontend Environment (if needed)

If the frontend URL changes, update in backend's `CLIENT_URL` env variable:
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
VITE_SOCKET_URL=https://YOUR-BACKEND-URL.onrender.com
```

### 2. Deploy NFT Contract

Once backend is live:

1. Get the NFT contract address from `PrithviLok/blockchain/contracts/EcoNFT.sol`
2. Deploy to Polygon Mumbai testnet
3. Update `NFT_CONTRACT_ADDRESS` and `DEPLOYER_PRIVATE_KEY` in backend env vars

### 3. Test Endpoints

**Health Check**:
```
GET https://YOUR-BACKEND-URL.onrender.com/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "🌍 PrithviLok API is running!"
}
```

**Frontend**:
Visit: `https://YOUR-FRONTEND-URL.onrender.com`

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. **Build Fails - Backend**
- Check logs for missing dependencies
- Ensure all npm packages install correctly
- Verify Node.js version compatibility

#### 2. **MongoDB Connection Error**
- Double-check `MONGO_URI` format
- Ensure IP whitelist includes Render's IPs (or use 0.0.0.0/0 for testing)
- Verify database user has correct permissions

#### 3. **CORS Errors**
- Verify `CLIENT_URL` matches your frontend URL exactly
- Check frontend is calling correct backend URL

#### 4. **Email Not Sending**
- Use Gmail App Password, not regular password
- Enable "Less secure app access" or use OAuth2
- Check EMAIL_HOST and EMAIL_PORT settings

#### 5. **API Keys Not Working**
- Regenerate API keys if expired
- Check rate limits on free tier APIs
- Verify keys have correct permissions

---

## 📊 Render Free Tier Limitations

- **Backend**: 750 hours/month free (enough for 1 instance)
- **Frontend**: Unlimited static sites
- **Bandwidth**: 100GB/month included
- **Auto-sleep**: Web services sleep after 15 min inactivity (free tier)

To prevent sleep, consider:
- Upgrading to paid plan ($7/month)
- Using uptime monitoring service (not recommended for production)

---

## 🎉 Success Indicators

✅ Both services show "Live" status  
✅ Health endpoint responds correctly  
✅ Frontend loads without errors  
✅ API calls from frontend work  
✅ WebSocket connections established  
✅ No error logs in Render dashboard  

---

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Hugging Face: https://huggingface.co/docs

---

## 🔐 Security Reminders

- Never commit `.env` files to GitHub
- Rotate secrets regularly
- Use strong, unique passwords
- Enable 2FA on Render account
- Monitor usage and logs regularly

---

**Good luck with your deployment! 🚀**
