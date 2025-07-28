# 🚀 Accio - AI-Powered Component Generator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://accio-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-blue)](https://accio-backend-364m.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20MongoDB-orange)](https://github.com/vamsi-lpu18/accio-project)

> **Accio** is a cutting-edge AI-powered component generator that helps developers build, customize, and export React components with ease. Create stunning UI components through natural language conversations with AI.

## 🌟 Live Demo

- **Frontend**: [https://accio-frontend.onrender.com](https://accio-frontend.onrender.com)
- **Backend API**: [https://accio-backend-364m.onrender.com](https://accio-backend-364m.onrender.com)

## ✨ Features

### 🎨 **AI-Powered Component Generation**
- **Natural Language Interface**: Describe components in plain English
- **Real-time AI Chat**: Interactive conversations to modify components
- **Smart Suggestions**: AI provides intelligent component recommendations
- **Multiple Code Types**: Support for JSX and TypeScript (TSX)

### 🛠️ **Component Builder**
- **Visual Editor**: Drag-and-drop component creation
- **Property Panel**: Real-time component customization
- **Live Preview**: Instant visual feedback
- **Code Export**: Download components as JSX/TSX files

### 📊 **Session Management**
- **User Authentication**: Secure JWT-based authentication
- **Session Persistence**: Save and load your work
- **Dashboard**: Organize and manage all your sessions
- **Search & Filter**: Find sessions quickly

### 🔧 **Developer Experience**
- **Code Editor**: Monaco Editor integration
- **Syntax Highlighting**: Professional code editing experience
- **Export Options**: ZIP files with component code and styles
- **Responsive Design**: Works on all devices

## 🏗️ Tech Stack

### **Frontend**
- **React 19** - Latest React with concurrent features
- **Next.js 15** - Full-stack React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Monaco Editor** - Professional code editor
- **JSZip** - File compression for exports

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication

### **AI Integration**
- **OpenAI API** - GPT models for component generation
- **Anthropic API** - Claude models for advanced reasoning
- **OpenRouter** - Unified AI API access

### **Deployment**
- **Render** - Cloud platform for hosting
- **GitHub** - Version control and CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- AI API keys (OpenAI, Anthropic, or OpenRouter)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vamsi-lpu18/accio-project.git
   cd accio-project
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   **Backend (.env)**
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   AI_SERVICE=openai
   API_KEYS=your_openai_api_key,your_anthropic_api_key
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   cd backend
   npm run dev
   
   # Start frontend (from frontend directory)
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)

## 📖 Usage Guide

### 1. **Getting Started**
- Visit the [live demo](https://accio-frontend.onrender.com)
- Sign up for a new account or log in
- Navigate to the Playground

### 2. **Creating Components**
- Use the AI chat to describe your component
- Examples:
  - "Create a red button with rounded corners"
  - "Make a card component with an image and title"
  - "Add a form with email and password fields"

### 3. **Customizing Components**
- Select components in the preview area
- Use the property panel to modify:
  - Colors and styling
  - Text content
  - Spacing and layout
  - Typography

### 4. **Saving and Managing**
- Click "Save Session" to store your work
- Access all sessions from the Dashboard
- Search and filter your saved sessions

### 5. **Exporting Code**
- Click "Export" to download your component
- Choose between JSX or TypeScript
- Get a ZIP file with component code and styles

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### AI Integration
- `POST /api/ai/generate` - Generate component code
- `POST /api/ai/refine` - Refine existing component
- `POST /api/ai/chat` - AI chat interface

## 🏗️ Project Structure

```
accio-project/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── .env
├── frontend/               # Next.js/React frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   └── services/      # API service layer
│   ├── package.json
│   └── next.config.mjs
├── render.yaml            # Render deployment config
└── README.md
```

## 🚀 Deployment

### Render Deployment
This project is configured for easy deployment on Render:

1. **Fork the repository** to your GitHub account
2. **Connect to Render** and create new services:
   - **Web Service** for backend
   - **Static Site** for frontend
3. **Set environment variables** in Render dashboard
4. **Deploy automatically** on every push

### Environment Variables for Production

**Backend (Render Web Service)**
```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-url.onrender.com
AI_SERVICE=openai
API_KEYS=your_openai_api_key,your_anthropic_api_key
```

**Frontend (Render Static Site)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **Anthropic** for Claude models
- **Render** for hosting infrastructure
- **MongoDB Atlas** for database services
- **Next.js** and **React** communities

## 📞 Support

- **Live Demo**: [https://accio-frontend.onrender.com](https://accio-frontend.onrender.com)
- **Issues**: [GitHub Issues](https://github.com/vamsi-lpu18/accio-project/issues)
- **Email**: Contact through GitHub

---

<div align="center">
  <p>Made with ❤️ by the Accio Team</p>
  <p>
    <a href="https://accio-frontend.onrender.com">🌐 Live Demo</a> •
    <a href="https://github.com/vamsi-lpu18/accio-project">📦 GitHub</a> •
    <a href="https://github.com/vamsi-lpu18/accio-project/issues">🐛 Report Bug</a>
  </p>
</div>
