# 🚀 Accio Project Setup Guide

Welcome to Accio - an AI-powered component playground! This guide will help you set up the project locally.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **OpenAI API** key (or OpenRouter)

## 🛠️ Quick Setup

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the setup script:**
   ```bash
   node setup.js
   ```

4. **When prompted, enter your configuration:**
   - **MongoDB Atlas URI**: Your MongoDB Atlas connection string
   - **JWT Secret**: Press enter for auto-generated
   - **Frontend URL**: `http://localhost:3000`
   - **AI Service**: `openai`
   - **OpenAI API Key**: `your_openai_api_key_here`

5. **Test the backend connection:**
   ```bash
   npm run test-db
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create `.env.local` in the frontend directory with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

### Step 3: Test the Integration

1. **Open your browser** to `http://localhost:3000`

2. **Create an account** at `http://localhost:3000/signup`

3. **Login** at `http://localhost:3000/login`

4. **Go to playground** at `http://localhost:3000/playground`

5. **Test AI features:**
   - Try saying "make the button red"
   - Try saying "add a card"
   - Try saying "make it larger"

## 🔧 Troubleshooting

### Backend Issues

**"MongoDB connection failed"**
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in Atlas
- Verify username/password

**"AI service not available"**
- Check your OpenAI API key
- Ensure you have credits in your OpenAI account
- Verify the API key format

### Frontend Issues

**"Cannot connect to backend"**
- Ensure backend is running on port 3001
- Check CORS settings in backend
- Verify `.env.local` file exists

**"Authentication failed"**
- Check JWT secret in backend
- Clear browser localStorage
- Try creating a new account

## 📊 What's Working Now

### ✅ **Backend Features**
- **Authentication**: Real JWT-based login/signup
- **Session Management**: MongoDB Atlas storage
- **AI Integration**: Real OpenAI API calls
- **Security**: CORS, rate limiting, validation

### ✅ **Frontend Features**
- **Real API Calls**: No more localStorage
- **AI Chat**: Connected to OpenAI
- **Session Saving**: Backend persistence
- **Authentication**: Real login/signup

### ✅ **AI Capabilities**
- **Component Generation**: From natural language
- **Component Refinement**: Modify existing components
- **Property Updates**: Change colors, sizes, text
- **Element Addition**: Add new components

## 🚀 Deployment

### Render Deployment

1. **Backend Service:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Frontend Service:**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `out`

### Environment Variables

**Backend:**
```
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=https://your-frontend-url.onrender.com
AI_SERVICE=openrouter
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

## 🎯 Next Steps

1. **Set up your API keys**
2. **Configure MongoDB Atlas**
3. **Deploy to Render**
4. **Test all features**
5. **Share your project!**

Happy coding! 🎉 