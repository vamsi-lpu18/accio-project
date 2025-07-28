# MongoDB Atlas Setup Guide

## 🚀 Setting up MongoDB Atlas for Accio Backend

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in
3. Create a new project called "Accio"

### Step 2: Create a Cluster

1. **Click "Build a Database"**
2. **Choose "FREE" tier** (M0 Sandbox)
3. **Select Cloud Provider & Region** (choose closest to you)
4. **Click "Create"**

### Step 3: Set Up Database Access

1. **Go to "Database Access"** in the left sidebar
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Create username and password** (save these!)
5. **Select "Read and write to any database"**
6. **Click "Add User"**

### Step 4: Set Up Network Access

1. **Go to "Network Access"** in the left sidebar
2. **Click "Add IP Address"**
3. **For development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. **For production**: Add your specific IP addresses
5. **Click "Confirm"**

### Step 5: Get Your Connection String

1. **Go to "Database"** in the left sidebar
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Copy the connection string**

### Step 6: Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/accio?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Service Configuration
AI_SERVICE=openai
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Step 7: Test the Connection

Run the test script to verify your MongoDB Atlas connection:

```bash
cd backend
npm install
node src/test.js
```

You should see:
```
✅ Database connection successful
✅ User model loaded
✅ Session model loaded
✅ Password hashing working: true
✅ JWT generation working
✅ All tests passed!
```

## 🔧 Troubleshooting

### Connection Issues

**Error: "MongoServerSelectionError"**
- Check if your IP is whitelisted in Network Access
- Verify username/password in connection string
- Ensure cluster is running

**Error: "Authentication failed"**
- Double-check username and password
- Make sure user has proper permissions
- Try creating a new database user

### Performance Tips

1. **Use indexes** for better query performance
2. **Monitor usage** in Atlas dashboard
3. **Set up alerts** for when you approach limits
4. **Use connection pooling** (already configured in the code)

## 📊 Atlas Dashboard Features

### Monitoring
- **Metrics**: Monitor database performance
- **Logs**: View database logs
- **Alerts**: Set up notifications

### Security
- **Encryption**: Data encrypted at rest and in transit
- **Backups**: Automatic backups (paid plans)
- **Audit Logs**: Track database access

### Scaling
- **Free Tier**: 512MB storage, shared RAM
- **Paid Plans**: Scale up as needed
- **Global Clusters**: Deploy worldwide

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:prod-password@cluster.mongodb.net/accio-prod?retryWrites=true&w=majority
JWT_SECRET=very-long-random-secret-key-for-production
FRONTEND_URL=https://your-domain.com
```

### Security Checklist

- [ ] Use strong JWT secret
- [ ] Whitelist only necessary IPs
- [ ] Use dedicated database user for production
- [ ] Enable MongoDB Atlas security features
- [ ] Set up monitoring and alerts

## 💡 Pro Tips

1. **Free Tier Limits**: 512MB storage, shared resources
2. **Development**: Use "Allow Access from Anywhere" for easy testing
3. **Production**: Whitelist only your server IPs
4. **Backups**: Free tier includes basic backups
5. **Monitoring**: Use Atlas dashboard to monitor usage

## 🔗 Useful Links

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [Atlas Security Best Practices](https://docs.atlas.mongodb.com/security/)
- [Performance Optimization](https://docs.atlas.mongodb.com/performance/)

## 🆘 Need Help?

If you encounter issues:

1. **Check Atlas Status**: [status.mongodb.com](https://status.mongodb.com/)
2. **MongoDB Community**: [community.mongodb.com](https://community.mongodb.com/)
3. **Atlas Support**: Available in your Atlas dashboard 