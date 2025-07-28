const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['button', 'input', 'heading', 'card', 'image']
  },
  properties: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'ai']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Session name is required'],
    trim: true,
    maxlength: [100, 'Session name cannot be more than 100 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  elements: {
    type: [elementSchema],
    default: []
  },
  chat: {
    type: [chatMessageSchema],
    default: []
  },
  code: {
    jsx: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    }
  },
  selectedId: {
    type: Number,
    default: null
  },
  codeType: {
    type: String,
    enum: ['jsx', 'tsx'],
    default: 'jsx'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    default: null
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastModified on save
sessionSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Index for better query performance
sessionSchema.index({ user: 1, createdAt: -1 });
sessionSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Session', sessionSchema); 