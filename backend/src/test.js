const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test database connection
const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/accio-test');
    console.log('✅ Database connection successful');
    
    // Test User model
    const User = require('./models/User');
    console.log('✅ User model loaded');
    
    // Test Session model
    const Session = require('./models/Session');
    console.log('✅ Session model loaded');
    
    // Test password hashing
    const testPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('✅ Password hashing working:', isMatch);
    
    // Test JWT generation
    const testToken = jwt.sign({ userId: 'test123' }, process.env.JWT_SECRET || 'test-secret');
    console.log('✅ JWT generation working');
    
    await mongoose.connection.close();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  testDatabase();
}

module.exports = { testDatabase }; 