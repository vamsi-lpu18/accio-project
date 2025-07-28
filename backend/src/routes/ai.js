const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * Supported AI services:
 * - openai (requires OPENAI_API_KEY)
 * - anthropic (requires ANTHROPIC_API_KEY)
 * - openrouter (requires OPENROUTER_API_KEY)
 *
 * Set AI_SERVICE in your .env to select the provider.
 */
// AI service configuration
const AI_SERVICES = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
};

// Generate component code using AI
const generateComponent = async (prompt, codeType = 'jsx', existingCode = null) => {
  try {
    const service = process.env.AI_SERVICE || 'openai';
    const config = AI_SERVICES[service];
    
    if (!config) {
      throw new Error('AI service not configured');
    }

    let systemPrompt = `You are an expert React developer. Generate ${codeType.toUpperCase()} code based on the user's request. 
    
Requirements:
- Return ONLY the component code, no explanations
- Use modern React patterns
- Include proper TypeScript types if TSX is requested
- Use inline styles or CSS classes as appropriate
- Make components responsive and accessible
- Follow best practices for React development

${codeType === 'tsx' ? 'Use TypeScript with proper interfaces and types.' : 'Use JavaScript with JSX.'}`;

    if (existingCode) {
      systemPrompt += `\n\nExisting code to modify:\n${existingCode}\n\nModify the existing code based on the user's request.`;
    }

    let requestBody;
    
    if (service === 'openai' || service === 'openrouter') {
      requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      };
    } else if (service === 'anthropic') {
      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\nUser request: ${prompt}` }
        ]
      };
    }

    const response = await axios.post(config.url, requestBody, { headers: config.headers });
    
    let generatedCode;
    if (service === 'openai' || service === 'openrouter') {
      generatedCode = response.data.choices[0].message.content;
    } else if (service === 'anthropic') {
      generatedCode = response.data.content[0].text;
    }

    // Clean up the generated code
    generatedCode = generatedCode.trim();
    
    // Remove markdown code blocks if present
    if (generatedCode.startsWith('```')) {
      generatedCode = generatedCode.replace(/^```(jsx|tsx|javascript|typescript)?\n/, '').replace(/\n```$/, '');
    }

    return {
      success: true,
      code: generatedCode,
      language: codeType
    };

  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate component'
    };
  }
};

// @route   POST /api/ai/generate
// @desc    Generate a new component
// @access  Private
router.post('/generate', auth, [
  body('prompt').trim().isLength({ min: 1, max: 1000 }).withMessage('Prompt is required and must be less than 1000 characters'),
  body('codeType').optional().isIn(['jsx', 'tsx']).withMessage('Code type must be jsx or tsx')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, codeType = 'jsx' } = req.body;

    const result = await generateComponent(prompt, codeType);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      message: 'Component generated successfully',
      code: result.code,
      language: result.language
    });

  } catch (error) {
    console.error('Generate component error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/ai/refine
// @desc    Refine existing component
// @access  Private
router.post('/refine', auth, [
  body('prompt').trim().isLength({ min: 1, max: 1000 }).withMessage('Prompt is required and must be less than 1000 characters'),
  body('existingCode').notEmpty().withMessage('Existing code is required'),
  body('codeType').optional().isIn(['jsx', 'tsx']).withMessage('Code type must be jsx or tsx')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, existingCode, codeType = 'jsx' } = req.body;

    const result = await generateComponent(prompt, codeType, existingCode);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      message: 'Component refined successfully',
      code: result.code,
      language: result.language
    });

  } catch (error) {
    console.error('Refine component error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI for component modifications
// @access  Private (temporarily public for testing)
router.post('/chat', [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be less than 1000 characters'),
  body('context').optional().isObject().withMessage('Context must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context } = req.body;
    
    // Build context-aware prompt
    let prompt = `User request: ${message}`;
    
    if (context) {
      if (context.elements && context.elements.length > 0) {
        prompt += `\n\nCurrent elements: ${JSON.stringify(context.elements, null, 2)}`;
      }
      if (context.selectedId) {
        prompt += `\n\nSelected element ID: ${context.selectedId}`;
      }
      if (context.codeType) {
        prompt += `\n\nCode type: ${context.codeType}`;
      }
    }

    const systemPrompt = `You are an AI assistant helping users modify React components. 

IMPORTANT: When suggesting changes, provide ONLY the JSON structure that should be applied to the component.

For example, if asked to change color to pink, respond with:
"I'll change the button color to pink for you!"

And include ONLY the JSON structure:
{
  "id": [element_id],
  "type": "button", 
  "properties": {
    "text": "Click Me",
    "color": "#ff69b4",
    "fontSize": 16,
    "padding": 12,
    "margin": 0,
    "borderRadius": 6,
    "boxShadow": false,
    "fontWeight": "normal"
  }
}

For adding new elements, respond with:
"I'll add a new [element_type] for you!"

And include the JSON structure for the new element.

Available element types: button, card, input, heading, image

Be concise and only provide the JSON structure for the specific change requested.`;

    const service = process.env.AI_SERVICE || 'openai';
    const config = AI_SERVICES[service];
    
    let requestBody;
    
    if (service === 'openai' || service === 'openrouter') {
      requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };
    } else if (service === 'anthropic') {
      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ]
      };
    }

    const response = await axios.post(config.url, requestBody, { headers: config.headers });
    
    let aiResponse;
    if (service === 'openai' || service === 'openrouter') {
      aiResponse = response.data.choices[0].message.content;
    } else if (service === 'anthropic') {
      aiResponse = response.data.content[0].text;
    }

    res.json({
      message: 'AI response generated',
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('AI API Error Response:', error.response.data);
      return res.status(500).json({ 
        error: 'AI service error',
        details: error.response.data?.error?.message || 'Unknown AI service error'
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// @route   GET /api/ai/status
// @desc    Check AI service status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const service = process.env.AI_SERVICE || 'openai';
    const config = AI_SERVICES[service];
    
    if (!config) {
      return res.status(503).json({ 
        status: 'unavailable',
        service: 'none',
        message: 'No AI service configured'
      });
    }

    res.json({
      status: 'available',
      service,
      message: 'AI service is ready'
    });

  } catch (error) {
    console.error('AI status check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 