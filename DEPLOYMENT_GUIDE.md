# 🚀 Step-by-Step Guide to Host Your Accio Project on Render

## Step 1: Create Render Account

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with your GitHub account** (recommended)
4. **Complete your profile setup**

## Step 2: Deploy Backend First

### 2.1 Create Backend Service
1. **Click "New +"** in your Render dashboard
2. **Select "Web Service"**
3. **Connect your GitHub repository:**
   - Click "Connect a repository"
   - Select `vamsi-lpu18/accio-project`
   - Click "Connect"

### 2.2 Configure Backend Settings
Fill in these details:

**Basic Settings:**
- **Name**: `accio-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Add Environment Variables
Click "Environment" tab and add these variables:

```
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
AI_SERVICE=openrouter
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string
- Replace `your_openai_api_key` with your actual OpenAI API key
- Replace `your_openrouter_api_key` with your actual OpenRouter API key
- For `JWT_SECRET`, you can use any secure random string

### 2.4 Deploy Backend
1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Note your backend URL** (e.g., `https://accio-backend.onrender.com`)

## Step 3: Deploy Frontend

### 3.1 Create Frontend Service
1. **Click "New +"** again
2. **Select "Static Site"**
3. **Connect the same GitHub repository**

### 3.2 Configure Frontend Settings
Fill in these details:

**Basic Settings:**
- **Name**: `accio-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `out`

### 3.3 Add Environment Variables
Click "Environment" tab and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url` with your actual backend URL** (e.g., `https://accio-backend.onrender.com`)

### 3.4 Deploy Frontend
1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Note your frontend URL** (e.g., `https://accio-frontend.onrender.com`)

## Step 4: Update Environment Variables

### 4.1 Update Backend
1. **Go back to your backend service**
2. **Click "Environment"**
3. **Update the FRONTEND_URL variable:**
   ```
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```
4. **Click "Save Changes"**
5. **Redeploy** (Render will auto-redeploy)

### 4.2 Update Frontend
1. **Go to your frontend service**
2. **Click "Environment"**
3. **Update the NEXT_PUBLIC_API_URL variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
4. **Click "Save Changes"**
5. **Redeploy** (Render will auto-redeploy)

## Step 5: Test Your Deployment

### 5.1 Test Backend
1. **Visit your backend URL** + `/health`
   - Example: `https://accio-backend.onrender.com/health`
2. **You should see a JSON response**

### 5.2 Test Frontend
1. **Visit your frontend URL**
   - Example: `https://accio-frontend.onrender.com`
2. **Test the features:**
   - Create an account
   - Login
   - Go to playground
   - Test AI features

## Step 6: Troubleshooting

### Common Issues:

**Backend Issues:**
- **"MongoDB connection failed"**: Check your MongoDB Atlas connection string and IP whitelist
- **"AI service not available"**: Check your API keys
- **"Port already in use"**: This is normal, Render handles this

**Frontend Issues:**
- **"Cannot connect to backend"**: Check your NEXT_PUBLIC_API_URL
- **"CORS errors"**: Backend should handle this automatically

**Render Issues:**
- **Build fails**: Check the build logs in Render dashboard
- **Service sleeps**: Free tier services sleep after 15 minutes of inactivity

## Step 7: Get Your API Keys

### MongoDB Atlas:
1. **Go to [mongodb.com/atlas](https://mongodb.com/atlas)**
2. **Create/Login to your account**
3. **Create a new cluster** (free tier)
4. **Get connection string** from "Connect" button
5. **Add your IP to whitelist** (or use 0.0.0.0/0 for all IPs)

### OpenAI API:
1. **Go to [platform.openai.com](https://platform.openai.com)**
2. **Create/Login to your account**
3. **Go to API Keys section**
4. **Create new API key**

### OpenRouter API:
1. **Go to [openrouter.ai](https://openrouter.ai)**
2. **Create/Login to your account**
3. **Go to API Keys section**
4. **Create new API key**

## 🎉 Success!

Once everything is deployed, you'll have:
- **Backend**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`

Your Accio project will be live and accessible to anyone! 🚀 