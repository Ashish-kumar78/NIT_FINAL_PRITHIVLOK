# 🍃 MongoDB Atlas Setup Guide

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card required)
3. Verify your email

### 2. Create a Cluster

1. **After login**, click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier
3. Select **AWS** as cloud provider
4. Choose region closest to you (or closest to Render's regions):
   - US East (N. Virginia) - Recommended for Render
   - US West (Oregon)
   - Europe (Frankfurt)
   - Asia Pacific (Singapore)
5. Click **"Create Cluster"**
6. Wait 3-5 minutes for cluster provisioning

### 3. Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication
4. Enter username: `prithvilok_admin`
5. Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Set **Database User Privileges**: 
   - Click **"Additional Settings"**
   - Select **"Atlas admin"** role
7. Click **"Add User"**

### 4. Whitelist IP Address

1. Click **"Network Access"** in left sidebar
2. Click **"+ ADD IP ADDRESS"**
3. For development/testing:
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0`
4. Click **"Confirm"**

⚠️ **Security Note**: For production, restrict to specific IPs

### 5. Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://prithvilok_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

### 6. Update Connection String for Render

Replace `<password>` with your actual password:

```
mongodb+srv://prithvilok_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prithvilok?retryWrites=true&w=majority
```

**Important**: 
- URL encode special characters in password
- Add database name at end: `/prithvilok`
- Example with special chars: if password is `abc$def`, use `abc%24def`

### 7. Test Connection

Use this tool to verify: https://mongoplayground.net/

Or test locally:
```javascript
// In a Node.js file or MongoDB Compass
const mongoose = require('mongoose');

mongoose.connect('YOUR_CONNECTION_STRING')
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ Connection failed:', err));
```

---

## 🔧 Add to Render Environment Variables

Copy your final connection string and add it to Render:

**Variable Name**: `MONGO_URI`
**Value**: `mongodb+srv://prithvilok_admin:encoded_password@cluster0.xxxxx.mongodb.net/prithvilok?retryWrites=true&w=majority`

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] M0 Free cluster created and running
- [ ] Database user created with password saved
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Connection string copied
- [ ] Password URL-encoded if needed
- [ ] Database name added to connection string
- [ ] Added to Render as `MONGO_URI` environment variable

---

## 🐛 Troubleshooting

### "Authentication failed" error
- Double-check username and password
- Ensure password is URL-encoded
- Verify user has correct permissions

### "Network timeout" error
- Check Network Access settings
- Ensure IP is whitelisted
- Try pinging from different network

### "Database not found" error
- Add database name to connection string: `/prithvilok`
- Check spelling in connection string

---

## 📊 MongoDB Atlas Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: Max 500 (more than enough for Render free tier)
- **Backups**: Not included (consider manual exports)

---

## 🔒 Security Best Practices

1. **Never commit** connection strings to GitHub
2. Use **strong passwords** (16+ characters)
3. **Rotate credentials** every 90 days
4. Restrict **IP whitelist** in production
5. Enable **encryption** at rest (default in Atlas)

---

**Need help?** 
- MongoDB Docs: https://www.mongodb.com/docs/atlas/getting-started/
- Render + MongoDB: https://render.com/docs/mongodb-atlas
