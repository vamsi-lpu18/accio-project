# Accio Backend

A Node.js/Express backend for the Accio AI-driven component playground platform.

## Features

- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **Session Management**: Full CRUD operations for user sessions with state persistence
- **AI Integration**: OpenAI and Anthropic integration for component generation and refinement
- **MongoDB**: Robust data persistence with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation
- **RESTful API**: Clean, documented REST endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **AI Services**: OpenAI GPT-4, Anthropic Claude
- **Security**: Helmet, CORS, rate limiting

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- AI API key (OpenAI or Anthropic)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/accio
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   AI_SERVICE=openai
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/preferences` | Update user preferences |
| POST | `/api/auth/logout` | Logout user |

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get user sessions |
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions/:id` | Get specific session |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |
| POST | `/api/sessions/:id/duplicate` | Duplicate session |
| GET | `/api/sessions/public` | Get public sessions |

### AI Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate new component |
| POST | `/api/ai/refine` | Refine existing component |
| POST | `/api/ai/chat` | Chat with AI |
| GET | `/api/ai/status` | Check AI service status |

## Data Models

### User
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  avatar: String,
  isVerified: Boolean,
  lastLogin: Date,
  preferences: {
    theme: String (light/dark/auto),
    codeType: String (jsx/tsx)
  }
}
```

### Session
```javascript
{
  name: String (required),
  user: ObjectId (ref: User),
  elements: [ElementSchema],
  chat: [ChatMessageSchema],
  code: {
    jsx: String,
    css: String
  },
  selectedId: Number,
  codeType: String (jsx/tsx),
  isPublic: Boolean,
  tags: [String],
  description: String
}
```

## AI Integration

The backend supports multiple AI services for component generation:

### OpenAI
- Model: GPT-4
- Endpoint: `/v1/chat/completions`
- Environment variable: `OPENAI_API_KEY`

### Anthropic
- Model: Claude 3 Sonnet
- Endpoint: `/v1/messages`
- Environment variable: `ANTHROPIC_API_KEY`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Request rate limiting to prevent abuse
- **Helmet**: Security headers middleware
- **MongoDB Injection Protection**: Mongoose schema validation

## Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/accio |
| `JWT_SECRET` | JWT signing secret | (required) |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `AI_SERVICE` | AI service provider | openai |
| `OPENAI_API_KEY` | OpenAI API key | (required if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key | (required if using Anthropic) |

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI
   - Set up AI service API keys

2. **Security**
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up rate limiting
   - Use environment-specific configurations

3. **Monitoring**
   - Set up logging
   - Monitor API performance
   - Track AI service usage

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": { ... }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 