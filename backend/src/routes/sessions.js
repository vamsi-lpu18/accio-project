const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const { auth, optionalAuth } = require('../middleware/auth');
const archiver = require('archiver');

// In-memory storage for sessions when MongoDB is not available
let inMemorySessions = [];

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get all sessions for current user
// @access  Private (temporarily public for testing)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-lastModified' } = req.query;
    
    console.log('🔍 GET /api/sessions - User:', req.user?._id, 'Query params:', req.query);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('🔍 MongoDB not connected, using in-memory sessions');
      
      // Return in-memory sessions filtered by user
      const userSessions = inMemorySessions.filter(session => {
        // If user is authenticated, only show their sessions
        if (req.user?._id) {
          return session.user === req.user._id.toString();
        }
        // If no user, show anonymous sessions (for testing)
        return !session.user || session.user === 'anonymous';
      });

      const filteredSessions = userSessions.filter(session => {
        if (search) {
          const searchLower = search.toLowerCase();
          return session.name.toLowerCase().includes(searchLower) ||
                 (session.description && session.description.toLowerCase().includes(searchLower));
        }
        return true;
      });

      console.log('🔍 Found in-memory sessions:', filteredSessions.length);
      
      res.json({
        sessions: filteredSessions,
        totalPages: 1,
        currentPage: page,
        total: filteredSessions.length
      });
      return;
    }

    try {
      const query = req.user?._id ? { user: req.user._id } : {};
      
      // Search functionality
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const sessions = await Session.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        // .select('-elements -chat -code') // Removed to return full session data
        .exec();

      console.log('🔍 Found MongoDB sessions:', sessions.length);

      const total = await Session.countDocuments(query);

      res.json({
        sessions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      
      // Fallback: return empty sessions list
      res.json({
        sessions: [],
        totalPages: 0,
        currentPage: page,
        total: 0
      });
    }

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private (temporarily public for testing)
router.post('/', optionalAuth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Session name is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, elements, chat, code, selectedId, codeType, tags } = req.body;

    console.log('🔍 POST /api/sessions - Creating session:', { name, user: req.user?._id });

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, using in-memory storage');
      
      // Create session with in-memory storage
      const sessionId = Date.now().toString();
      const fallbackSession = {
        _id: sessionId,
        id: sessionId,
        name,
        description,
        user: req.user?._id?.toString() || 'anonymous',
        elements: elements || [],
        chat: chat || [],
        code: code || { jsx: '', css: '' },
        selectedId,
        codeType: codeType || 'jsx',
        tags: tags || [],
        createdAt: new Date(),
        lastModified: new Date()
      };

      // Save to in-memory storage
      inMemorySessions.push(fallbackSession);
      console.log('🔍 Saved session to in-memory storage:', sessionId);

      return res.status(201).json({
        message: 'Session created successfully (offline mode)',
        session: fallbackSession
      });
    }

    try {
      // Try to save to MongoDB
      const session = new Session({
        name,
        description,
        user: req.user?._id || new mongoose.Types.ObjectId('000000000000000000000000'), // Anonymous user ID
        elements: elements || [],
        chat: chat || [],
        code: code || { jsx: '', css: '' },
        selectedId,
        codeType: codeType || 'jsx',
        tags: tags || []
      });

      await session.save();

      res.status(201).json({
        message: 'Session created successfully',
        session
      });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      
      // Fallback: return success without saving to DB
      const fallbackSession = {
        id: Date.now().toString(),
        name,
        description,
        user: req.user?._id?.toString() || 'anonymous',
        elements: elements || [],
        chat: chat || [],
        code: code || { jsx: '', css: '' },
        selectedId,
        codeType: codeType || 'jsx',
        tags: tags || [],
        createdAt: new Date(),
        lastModified: new Date()
      };

      res.status(201).json({
        message: 'Session created successfully (offline mode)',
        session: fallbackSession
      });
    }

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get a specific session with full data
// @access  Private (temporarily public for testing)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    try {
      // Build query - if user is authenticated, filter by user, otherwise get any session
      const query = { _id: req.params.id };
      if (req.user?._id) {
        query.user = req.user._id;
      }

      const session = await Session.findOne(query);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({ session });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      res.status(404).json({ error: 'Session not found (offline mode)' });
    }

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update a session
// @access  Private (temporarily public for testing)
router.put('/:id', optionalAuth, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Session name must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await Session.findOne({
      _id: req.params.id
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update fields
    const updateFields = ['name', 'description', 'elements', 'chat', 'code', 'selectedId', 'codeType', 'tags', 'isPublic'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();

    res.json({
      message: 'Session updated successfully',
      session
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete a session
// @access  Private (temporarily public for testing)
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    // Build query - if user is authenticated, filter by user, otherwise delete any session
    const query = { _id: req.params.id };
    if (req.user?._id) {
      query.user = req.user._id;
    }

    const session = await Session.findOneAndDelete(query);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/duplicate
// @desc    Duplicate a session
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalSession = await Session.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!originalSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const duplicatedSession = new Session({
      name: `${originalSession.name} (Copy)`,
      description: originalSession.description,
      user: req.user._id,
      elements: originalSession.elements,
      chat: originalSession.chat,
      code: originalSession.code,
      selectedId: originalSession.selectedId,
      codeType: originalSession.codeType,
      tags: originalSession.tags,
      isPublic: false // Always set to false for duplicated sessions
    });

    await duplicatedSession.save();

    res.status(201).json({
      message: 'Session duplicated successfully',
      session: duplicatedSession
    });

  } catch (error) {
    console.error('Duplicate session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/sessions/public
// @desc    Get public sessions
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-lastModified' } = req.query;
    
    const query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sessions = await Session.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name')
      .select('-elements -chat -code')
      .exec();

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get public sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/sessions/:id/export
// @desc    Export session code as ZIP (JSX/TSX + CSS)
// @access  Private
router.get('/:id/export', auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Prepare code files
    const codeType = session.codeType || 'jsx';
    const jsxFile = `Component.${codeType}`;
    const cssFile = 'styles.css';
    const jsxContent = session.code && session.code.jsx ? session.code.jsx : '';
    const cssContent = session.code && session.code.css ? session.code.css : '';

    // Set response headers
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${session.name || 'session'}-code.zip"`
    });

    // Create archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => res.status(500).send({ error: err.message }));
    archive.pipe(res);

    archive.append(jsxContent, { name: jsxFile });
    archive.append(cssContent, { name: cssFile });
    archive.finalize();
  } catch (error) {
    console.error('Export session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 