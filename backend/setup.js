#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Accio Backend Setup for MongoDB Atlas');
console.log('==========================================\n');

const questions = [
  {
    name: 'port',
    question: 'What port should the server run on? (default: 3001): ',
    default: '3001'
  },
  {
    name: 'mongodbUri',
    question: 'Enter your MongoDB Atlas connection string: ',
    required: true
  },
  {
    name: 'jwtSecret',
    question: 'Enter a JWT secret key (or press enter for auto-generated): ',
    default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
  {
    name: 'frontendUrl',
    question: 'Frontend URL for CORS (default: http://localhost:3000): ',
    default: 'http://localhost:3000'
  },
  {
    name: 'aiService',
    question: 'AI Service (openai/anthropic, default: openai): ',
    default: 'openai'
  },
  {
    name: 'openaiKey',
    question: 'OpenAI API Key (optional): ',
    default: ''
  },
  {
    name: 'anthropicKey',
    question: 'Anthropic API Key (optional): ',
    default: ''
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  const question = questions[index];
  const defaultValue = typeof question.default === 'function' ? question.default() : question.default;

  rl.question(question.question, (answer) => {
    if (!answer && question.required) {
      console.log('❌ This field is required!');
      askQuestion(index);
      return;
    }

    answers[question.name] = answer || defaultValue;
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envContent = `# Server Configuration
PORT=${answers.port}
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=${answers.mongodbUri}

# JWT Configuration
JWT_SECRET=${answers.jwtSecret}

# Frontend URL (for CORS)
FRONTEND_URL=${answers.frontendUrl}

# AI Service Configuration
AI_SERVICE=${answers.aiService}
OPENAI_API_KEY=${answers.openaiKey}
ANTHROPIC_API_KEY=${answers.anthropicKey}
`;

  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Test connection: node src/test.js');
    console.log('3. Start development server: npm run dev');
    console.log('\n🔗 Your backend will be available at: http://localhost:' + answers.port);
    console.log('🔗 Health check: http://localhost:' + answers.port + '/health');
    
    if (!answers.openaiKey && !answers.anthropicKey) {
      console.log('\n⚠️  Note: No AI API keys provided. AI features will be disabled.');
      console.log('   Add your API keys to .env file to enable AI features.');
    }
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(0); 