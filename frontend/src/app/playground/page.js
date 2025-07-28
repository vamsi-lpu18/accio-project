"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import dynamic from "next/dynamic";
import PropertyPanel from "../../components/PropertyPanel";
import apiService from "../../services/api";
import { useSearchParams } from "next/navigation";

const CodeEditor = dynamic(() => import("../../components/CodeEditor"), { ssr: false });

const ELEMENT_TYPES = [
  { type: "button", label: "Button", icon: "🔘" },
  { type: "input", label: "Input", icon: "📝" },
  { type: "heading", label: "Heading", icon: "📋" },
  { type: "card", label: "Card", icon: "🃏" },
  { type: "image", label: "Image", icon: "🖼️" },
];

const DEFAULT_PROPERTIES = {
  button: {
    text: "Click Me",
    color: "#2563eb",
    fontSize: 16,
    padding: 12,
    margin: 0,
    borderRadius: 6,
    boxShadow: false,
    fontWeight: "normal",
  },
  input: {
    placeholder: "Type here...",
    color: "#2563eb",
    fontSize: 16,
    padding: 12,
    margin: 0,
    borderRadius: 6,
    boxShadow: false,
    fontWeight: "normal",
  },
  heading: {
    text: "Heading",
    color: "#171717",
    fontSize: 24,
    fontWeight: "bold",
    padding: 0,
    margin: 0,
  },
  card: {
    title: "Card Title",
    content: "This is a card with some content.",
    image: "",
    padding: 24,
    margin: 0,
    borderRadius: 12,
    boxShadow: false,
  },
  image: {
    src: "https://placekitten.com/300/200",
    alt: "A cute kitten",
    padding: 0,
    margin: 0,
    borderRadius: 8,
  },
};

function renderJSX(elements, codeType = "jsx") {
  const isTSX = codeType === "tsx";
  
  // Generate TypeScript interfaces for TSX
  const generateInterfaces = () => {
    if (!isTSX) return "";
    
    const interfaces = [];
    
    // Button interface
    if (elements.some(e => e.type === "button")) {
      interfaces.push(`interface ButtonProps {
  text: string;
  color: string;
  fontSize: number;
  padding: number;
  margin: number;
  borderRadius: number;
  boxShadow: boolean;
  fontWeight: string;
}`);
    }
    
    // Input interface
    if (elements.some(e => e.type === "input")) {
      interfaces.push(`interface InputProps {
  placeholder: string;
  color: string;
  fontSize: number;
  padding: number;
  margin: number;
  borderRadius: number;
  boxShadow: boolean;
  fontWeight: string;
}`);
    }
    
    // Heading interface
    if (elements.some(e => e.type === "heading")) {
      interfaces.push(`interface HeadingProps {
  text: string;
  color: string;
  fontSize: number;
  fontWeight: string;
  padding: number;
  margin: number;
}`);
    }
    
    // Card interface
    if (elements.some(e => e.type === "card")) {
      interfaces.push(`interface CardProps {
  title: string;
  content: string;
  image?: string;
  padding: number;
  margin: number;
  borderRadius: number;
  boxShadow: boolean;
}`);
    }
    
    // Image interface
    if (elements.some(e => e.type === "image")) {
      interfaces.push(`interface ImageProps {
  src: string;
  alt: string;
  padding: number;
  margin: number;
  borderRadius: number;
}`);
    }
    
    return interfaces.join("\n\n");
  };
  
  const importStatement = isTSX 
    ? "import React from 'react';\nimport { FC } from 'react';" 
    : "import React from 'react';";
  
  const componentSignature = isTSX 
    ? "const MyComponent: FC = () => {" 
    : "function MyComponent() {";
  
  return {
    imports: importStatement,
    interfaces: generateInterfaces(),
    component: elements.map(e => {
      if (e.type === "button") {
        return `<button style={{background: '${e.properties.color}', fontSize: ${e.properties.fontSize}, color: '#fff', padding: '${e.properties.padding}px 24px', margin: '${e.properties.margin}px', border: 'none', borderRadius: ${e.properties.borderRadius},${e.properties.boxShadow ? " boxShadow: '0 2px 8px rgba(0,0,0,0.15)'," : ''} fontWeight: '${e.properties.fontWeight}', display: 'inline-block'}}>${e.properties.text}</button>`;
      }
      if (e.type === "input") {
        return `<input placeholder='${e.properties.placeholder}' style={{background: '#fff', fontSize: ${e.properties.fontSize}, color: '${e.properties.color}', padding: '${e.properties.padding}px 24px', margin: '${e.properties.margin}px', border: '1px solid #ccc', borderRadius: ${e.properties.borderRadius},${e.properties.boxShadow ? " boxShadow: '0 2px 8px rgba(0,0,0,0.15)'," : ''} fontWeight: '${e.properties.fontWeight}', display: 'block', width: '100%', maxWidth: '300px'}} />`;
      }
      if (e.type === "heading") {
        return `<h2 style={{color: '${e.properties.color}', fontSize: ${e.properties.fontSize}, fontWeight: '${e.properties.fontWeight}', margin: '${e.properties.margin}px', padding: '${e.properties.padding}px', display: 'block'}}>${e.properties.text}</h2>`;
      }
      if (e.type === "card") {
        return `<div style={{border: '1px solid #e5e7eb', borderRadius: ${e.properties.borderRadius}, padding: '${e.properties.padding}px', margin: '${e.properties.margin}px', background: '#fff', boxShadow: ${e.properties.boxShadow ? "'0 2px 8px rgba(0,0,0,0.15)'" : "'0 2px 8px rgba(0,0,0,0.04)'"}, maxWidth: '300px', width: '100%', display: 'block'}}>
        <h3 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 8}}>${e.properties.title}</h3>
        <p style={{fontSize: 16, color: '#444'}}>${e.properties.content}</p>
        ${e.properties.image ? `<img src='${e.properties.image}' alt='Card image' style={{width: '100%', marginTop: 12, borderRadius: 8}} />` : ''}
      </div>`;
      }
      if (e.type === "image") {
        return `<img src='${e.properties.src}' alt='${e.properties.alt}' style={{maxWidth: '100%', borderRadius: ${e.properties.borderRadius}, maxHeight: '200px', objectFit: 'cover', margin: '${e.properties.margin}px', padding: '${e.properties.padding}px', display: 'block'}} />`;
      }
      return "";
    }).join("\n"),
    signature: componentSignature
  };
}

export default function PlaygroundPage() {
  const { chat, setChat, code, setCode } = useAppContext();
  const searchParams = useSearchParams();
  const [elements, setElements] = useState([
    { id: 1, type: "button", properties: { ...DEFAULT_PROPERTIES.button } },
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionName, setSessionName] = useState("Untitled Session");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [codeType, setCodeType] = useState("jsx"); // "jsx" or "tsx"
  const chatEndRef = useRef(null);
  const selectedElement = elements.find(e => e.id === selectedId);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Load session from URL parameter on component mount
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [searchParams]);

  // Add new element
  const addElement = type => {
    const id = Date.now();
    console.log('Adding element:', type, 'with id:', id);
    setElements([...elements, { id, type, properties: { ...DEFAULT_PROPERTIES[type] } }]);
    setSelectedId(id);
  };

  // Update properties of selected element
  const updateProperties = props => {
    setElements(elements.map(e => e.id === selectedId ? { ...e, properties: props } : e));
  };

  // Function to apply AI suggestions to elements
  const applyAIChanges = (userMessage, aiResponse, elements, selectedId) => {
    const lowerMessage = userMessage.toLowerCase();
    const selectedElement = elements.find(e => e.id === selectedId);
    
    // Try to extract changes from AI response
    try {
      // Look for JSON-like structures in AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Check if this is a new element to add
        if (parsed.type && !parsed.id) {
          // This is a new element to add
          const newId = Date.now();
          const newElement = {
            id: newId,
            type: parsed.type,
            properties: { ...DEFAULT_PROPERTIES[parsed.type], ...parsed.properties }
          };
          return [...elements, newElement];
        }
        
        // Check if this is modifying an existing element
        if (parsed.properties && selectedElement) {
          // Only apply the specific properties that were mentioned in the user request
          const userRequest = lowerMessage;
          const changes = {};
          
          // Check what the user actually asked for
          if (userRequest.includes('color') || userRequest.includes('pink') || userRequest.includes('red') || userRequest.includes('blue') || userRequest.includes('green') || userRequest.includes('yellow') || userRequest.includes('purple') || userRequest.includes('orange') || userRequest.includes('black') || userRequest.includes('white')) {
            changes.color = parsed.properties.color;
          }
          
          if (userRequest.includes('text') || userRequest.includes('change text')) {
            changes.text = parsed.properties.text;
          }
          
          if (userRequest.includes('margin')) {
            changes.margin = parsed.properties.margin;
          }
          
          if (userRequest.includes('padding')) {
            changes.padding = parsed.properties.padding;
          }
          
          if (userRequest.includes('font') || userRequest.includes('size') || userRequest.includes('larger') || userRequest.includes('smaller')) {
            changes.fontSize = parsed.properties.fontSize;
          }
          
          if (userRequest.includes('bold') || userRequest.includes('weight')) {
            changes.fontWeight = parsed.properties.fontWeight;
          }
          
          if (userRequest.includes('border') || userRequest.includes('radius') || userRequest.includes('rounded')) {
            changes.borderRadius = parsed.properties.borderRadius;
          }
          
          if (userRequest.includes('shadow') || userRequest.includes('boxshadow')) {
            changes.boxShadow = parsed.properties.boxShadow;
          }
          
          // Only apply changes if we found something to change
          if (Object.keys(changes).length > 0) {
            const newElements = elements.map(e => 
              e.id === selectedId 
                ? { ...e, properties: { ...e.properties, ...changes } }
                : e
            );
            return newElements;
          }
        }
      }
      
    } catch (error) {
      console.log('Could not parse AI response for changes:', error);
    }
    
    return null;
  };

  // Smart AI function to parse and apply changes dynamically
  const processAICommand = (message, elements, selectedId) => {
    const lowerMessage = message.toLowerCase();
    const selectedElement = elements.find(e => e.id === selectedId);
    console.log('Processing command:', message, 'lowerMessage:', lowerMessage);
    
    // Dynamic color detection and application
    const colorKeywords = {
      'red': '#ef4444',
      'blue': '#3b82f6', 
      'green': '#10b981',
      'yellow': '#fbbf24',
      'purple': '#8b5cf6',
      'pink': '#ff69b4',
      'orange': '#ff6b35',
      'black': '#000000',
      'white': '#ffffff'
    };
    
    // Check for color changes dynamically
    for (const [colorName, colorValue] of Object.entries(colorKeywords)) {
      if (lowerMessage.includes(colorName) && selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, color: colorValue } }
            : e
        );
        setElements(newElements);
        return `I've changed the color to ${colorName}!`;
      }
    }
    
    // Dynamic property modifications
    const propertyModifiers = {
      'larger': { property: 'fontSize', operation: 'increase', value: 4, max: 32 },
      'bigger': { property: 'fontSize', operation: 'increase', value: 4, max: 32 },
      'smaller': { property: 'fontSize', operation: 'decrease', value: 4, min: 12 },
      'more padding': { property: 'padding', operation: 'increase', value: 8, max: 48 },
      'increase padding': { property: 'padding', operation: 'increase', value: 8, max: 48 },
      'less padding': { property: 'padding', operation: 'decrease', value: 8, min: 4 },
      'decrease padding': { property: 'padding', operation: 'decrease', value: 8, min: 4 },
      'more margin': { property: 'margin', operation: 'increase', value: 8, max: 32 },
      'increase margin': { property: 'margin', operation: 'increase', value: 8, max: 32 },
      'less margin': { property: 'margin', operation: 'decrease', value: 8, min: 0 },
      'decrease margin': { property: 'margin', operation: 'decrease', value: 8, min: 0 },
      'rounder': { property: 'borderRadius', operation: 'increase', value: 4, max: 24 },
      'more rounded': { property: 'borderRadius', operation: 'increase', value: 4, max: 24 },
      'less rounded': { property: 'borderRadius', operation: 'decrease', value: 4, min: 0 },
      'sharper': { property: 'borderRadius', operation: 'decrease', value: 4, min: 0 },
      'bold': { property: 'fontWeight', operation: 'set', value: 'bold' },
      'normal': { property: 'fontWeight', operation: 'set', value: 'normal' }
    };
    
    // Check for property modifications dynamically
    for (const [keyword, modifier] of Object.entries(propertyModifiers)) {
      if (lowerMessage.includes(keyword) && selectedElement) {
        const currentValue = selectedElement.properties[modifier.property] || 0;
        let newValue;
        
        if (modifier.operation === 'increase') {
          newValue = Math.min(currentValue + modifier.value, modifier.max);
        } else if (modifier.operation === 'decrease') {
          newValue = Math.max(currentValue - modifier.value, modifier.min);
        } else if (modifier.operation === 'set') {
          newValue = modifier.value;
        }
        
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, [modifier.property]: newValue } }
            : e
        );
        setElements(newElements);
        return `I've made it ${keyword}!`;
      }
    }
    
    // Size changes
    if (lowerMessage.includes('larger') || lowerMessage.includes('bigger')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, fontSize: Math.min(e.properties.fontSize + 4, 32) } }
            : e
        );
        setElements(newElements);
        return "I've made it larger!";
      }
    }
    
    if (lowerMessage.includes('smaller')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, fontSize: Math.max(e.properties.fontSize - 4, 12) } }
            : e
        );
        setElements(newElements);
        return "I've made it smaller!";
      }
    }
    
    // Padding changes
    if (lowerMessage.includes('more padding') || lowerMessage.includes('increase padding') || lowerMessage.includes('add padding') || lowerMessage.includes('increase the padding')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, padding: Math.min((e.properties.padding || 12) + 8, 48) } }
            : e
        );
        setElements(newElements);
        return "I've increased the padding!";
      }
    }
    
    if (lowerMessage.includes('less padding') || lowerMessage.includes('decrease padding') || lowerMessage.includes('reduce padding') || lowerMessage.includes('decrease the padding')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, padding: Math.max((e.properties.padding || 12) - 8, 4) } }
            : e
        );
        setElements(newElements);
        return "I've decreased the padding!";
      }
    }
    
    // Margin changes
    if (lowerMessage.includes('more margin') || lowerMessage.includes('increase margin') || lowerMessage.includes('add margin') || lowerMessage.includes('increase the margin') || lowerMessage.includes('add some margin')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, margin: Math.min((e.properties.margin || 0) + 8, 32) } }
            : e
        );
        setElements(newElements);
        return "I've increased the margin!";
      }
    }
    
    if (lowerMessage.includes('less margin') || lowerMessage.includes('decrease margin') || lowerMessage.includes('reduce margin') || lowerMessage.includes('decrease the margin')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, margin: Math.max((e.properties.margin || 0) - 8, 0) } }
            : e
        );
        setElements(newElements);
        return "I've decreased the margin!";
      }
    }
    
    // Border radius changes
    if (lowerMessage.includes('rounder') || lowerMessage.includes('more rounded')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, borderRadius: Math.min((e.properties.borderRadius || 6) + 4, 24) } }
            : e
        );
        setElements(newElements);
        return "I've made it more rounded!";
      }
    }
    
    if (lowerMessage.includes('less rounded') || lowerMessage.includes('sharper')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, borderRadius: Math.max((e.properties.borderRadius || 6) - 4, 0) } }
            : e
        );
        setElements(newElements);
        return "I've made it less rounded!";
      }
    }
    
    // Font weight changes
    if (lowerMessage.includes('bold') || lowerMessage.includes('make bold')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, fontWeight: 'bold' } }
            : e
        );
        setElements(newElements);
        return "I've made it bold!";
      }
    }
    
    if (lowerMessage.includes('normal') || lowerMessage.includes('make normal')) {
      if (selectedElement) {
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, fontWeight: 'normal' } }
            : e
        );
        setElements(newElements);
        return "I've made it normal weight!";
      }
    }
    
    // Dynamic text changes
    const textChangePatterns = [
      /change text to (.+)/i,
      /text to (.+)/i,
      /change the text to (.+)/i,
      /set text to (.+)/i,
      /make it say (.+)/i,
      /change to (.+)/i
    ];
    
    for (const pattern of textChangePatterns) {
      const textMatch = message.match(pattern);
      if (textMatch && selectedElement) {
        const newText = textMatch[1];
        const newElements = elements.map(e => 
          e.id === selectedId 
            ? { ...e, properties: { ...e.properties, text: newText } }
            : e
        );
        setElements(newElements);
        return `I've changed the text to "${newText}"!`;
      }
    }
    
    // Simple text changes (like "hii", "hello", etc.)
    if (lowerMessage.length <= 10 && !lowerMessage.includes(' ') && selectedElement && !lowerMessage.includes('add') && !lowerMessage.includes('delete') && !lowerMessage.includes('remove')) {
      // If it's a short word/phrase, treat it as new text
      const newText = message;
      const newElements = elements.map(e => 
        e.id === selectedId 
          ? { ...e, properties: { ...e.properties, text: newText } }
          : e
      );
      setElements(newElements);
      return `I've changed the text to "${newText}"!`;
    }
    
    // Dynamic element addition
    const elementTypes = {
      'button': { keywords: ['button', 'btn'], label: 'button' },
      'card': { keywords: ['card', 'box'], label: 'card' },
      'input': { keywords: ['input', 'field', 'textbox'], label: 'input field' },
      'heading': { keywords: ['heading', 'title', 'header'], label: 'heading' },
      'image': { keywords: ['image', 'picture', 'img', 'photo'], label: 'image' }
    };
    
    // Check for element addition dynamically
    for (const [elementType, config] of Object.entries(elementTypes)) {
      for (const keyword of config.keywords) {
        if ((lowerMessage.includes('add') || lowerMessage.includes('create') || lowerMessage.includes('new')) && lowerMessage.includes(keyword)) {
          addElement(elementType);
          return `I've added a new ${config.label}!`;
        }
      }
    }
    
    // Dynamic element deletion
    if ((lowerMessage.includes('delete') || lowerMessage.includes('remove') || lowerMessage.includes('delete this') || lowerMessage.includes('remove this')) && selectedElement) {
      const newElements = elements.filter(e => e.id !== selectedId);
      if (newElements.length > 0) {
        setElements(newElements);
        setSelectedId(newElements[0].id);
        return "I've deleted the selected element!";
      } else {
        // If no elements left, add a default button
        addElement('button');
        return "I've deleted the element and added a new button!";
      }
    }
    
    // Delete specific element types
    for (const [elementType, config] of Object.entries(elementTypes)) {
      for (const keyword of config.keywords) {
        if ((lowerMessage.includes('delete') || lowerMessage.includes('remove')) && lowerMessage.includes(keyword)) {
          const elementsToDelete = elements.filter(e => e.type === elementType);
          if (elementsToDelete.length > 0) {
            const newElements = elements.filter(e => e.type !== elementType);
            if (newElements.length > 0) {
              setElements(newElements);
              setSelectedId(newElements[0].id);
              return `I've deleted all ${config.label}s!`;
            } else {
              addElement('button');
              return `I've deleted all ${config.label}s and added a new button!`;
            }
          }
        }
      }
    }
    
    // Clear all elements
    if (lowerMessage.includes('clear all') || lowerMessage.includes('reset') || lowerMessage.includes('start over') || lowerMessage.includes('clear everything')) {
      const newElements = [{ id: Date.now(), type: "button", properties: { ...DEFAULT_PROPERTIES.button } }];
      setElements(newElements);
      setSelectedId(newElements[0].id);
      return "I've cleared everything and started fresh!";
    }
    
    // Default response
    return `I understand you want to modify the component. Try saying things like "make it red", "make it larger", "add more padding", or "change text to something". You can also say "add button" or "add card" to create new elements.`;
  };

  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Add user message to chat
    const newChat = [...chat, { role: 'user', content: userMessage }];
    setChat(newChat);
    setIsLoading(true);

    try {
      // First try local processing for simple commands
      const localResponse = processAICommand(userMessage, elements, selectedId);
      
      // If local processing handled it, use that response
      if (localResponse !== `I understand you want to modify the component. Try saying things like "make it red", "make it larger", "add more padding", or "change text to something". You can also say "add button" or "add card" to create new elements.`) {
        setChat([...newChat, { role: 'ai', content: localResponse }]);
        setIsLoading(false);
        return;
      }

      // If local processing didn't handle it, try AI API
      const context = {
        elements,
        selectedId,
        codeType
      };
      
      const response = await apiService.chatWithAI(userMessage, context);
      
      // Add AI response to chat
      setChat([...newChat, { role: 'ai', content: response.response }]);
      
      // Now try to apply the AI's suggestions locally
      const appliedChanges = applyAIChanges(userMessage, response.response, elements, selectedId);
      if (appliedChanges) {
        setElements(appliedChanges);
      }
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      // Fallback to local processing if API fails
      const aiResponse = processAICommand(userMessage, elements, selectedId);
      setChat([...newChat, { role: 'ai', content: aiResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save session to backend
  const saveSession = async () => {
    try {
      const sessionData = {
        name: sessionName,
        elements,
        chat,
        code,
        selectedId,
        codeType
      };
      
      console.log('Saving session:', sessionData);
      
      let response;
      if (currentSessionId) {
        // Update existing session
        console.log('Updating existing session:', currentSessionId);
        response = await apiService.updateSession(currentSessionId, sessionData);
      } else {
        // Create new session
        console.log('Creating new session');
        response = await apiService.createSession(sessionData);
        // Set the current session ID for future updates
        setCurrentSessionId(response.session._id || response.session.id);
      }
      
      console.log('Session saved successfully:', response);
      setShowSaveModal(false);
      
      // Show success message
      alert('Session saved successfully!');
      
      return response.session;
    } catch (error) {
      console.error('Save session error:', error);
      
      // Try to save locally as fallback
      try {
        const localSession = {
          id: Date.now().toString(),
          name: sessionName,
          elements,
          chat,
          code,
          selectedId,
          codeType,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingSessions = JSON.parse(localStorage.getItem('accio-sessions') || '[]');
        existingSessions.push(localSession);
        localStorage.setItem('accio-sessions', JSON.stringify(existingSessions));
        
        setShowSaveModal(false);
        alert('Session saved locally (offline mode). You can still work on your components!');
        
        return localSession;
      } catch (localError) {
        console.error('Local save also failed:', localError);
        
        // Provide more detailed error message
        let errorMessage = 'Failed to save session. ';
        if (error.response?.data?.error) {
          errorMessage += error.response.data.error;
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Please try again.';
        }
        
        alert(errorMessage);
      }
    }
  };

  // Load session from backend or localStorage
  const loadSession = async (sessionId) => {
    try {
      console.log('Loading session:', sessionId);
      
      // First try to load from backend
      try {
        const response = await apiService.getSession(sessionId);
        const session = response.session;
        
        if (session) {
          console.log('Session loaded from backend:', session);
          setElements(session.elements || []);
          setChat(session.chat || []);
          setCode(session.code || { jsx: "", css: "" });
          setSessionName(session.name || "Untitled Session");
          setCurrentSessionId(sessionId);
          setCodeType(session.codeType || "jsx");
          if (session.elements && session.elements.length > 0) {
            setSelectedId(session.elements[0].id);
          }
          return;
        }
      } catch (backendError) {
        console.log('Backend load failed, trying localStorage:', backendError);
      }
      
      // Fallback to localStorage
      const sessions = JSON.parse(localStorage.getItem('accio-sessions') || '[]');
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        console.log('Session loaded from localStorage:', session);
        setElements(session.elements || []);
        setChat(session.chat || []);
        setCode(session.code || { jsx: "", css: "" });
        setSessionName(session.name || "Untitled Session");
        setCurrentSessionId(sessionId);
        setCodeType(session.codeType || "jsx");
        if (session.elements && session.elements.length > 0) {
          setSelectedId(session.elements[0].id);
        }
      } else {
        console.log('Session not found in localStorage either');
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  // Update code when elements change
  useEffect(() => {
    const { imports, interfaces, component, signature } = renderJSX(elements, codeType);
    const interfacesSection = interfaces ? `\n${interfaces}\n` : "";
    const componentCode = `${imports}${interfacesSection}\nexport default ${signature}\n  return (\n    <div className="component-container">\n${component}\n    </div>\n  );\n}`;
    setCode({ jsx: componentCode, css: "" });
  }, [elements, codeType, setCode]);

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Playground Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Accio Playground</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSaveModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Session
            </button>
            <button 
              onClick={async () => {
                const zip = await import("jszip");
                const JSZip = zip.default;
                const zipFile = new JSZip();
                const fileExtension = codeType === "tsx" ? "tsx" : "jsx";
                zipFile.file(`Component.${fileExtension}`, code.jsx);
                zipFile.file("styles.css", code.css);
                
                // Add TypeScript config for TSX
                if (codeType === "tsx") {
                  const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}`;
                  zipFile.file("tsconfig.json", tsConfig);
                }
                
                const blob = await zipFile.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${sessionName.replace(/\s+/g, '-').toLowerCase()}.${fileExtension}.zip`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat Panel */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold text-lg text-gray-200 mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-400">Ask me to modify your components</p>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {chat.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-sm mb-4">Start a conversation to modify your components</p>
                <div className="text-xs space-y-2">
                  <p className="text-gray-500">Try saying:</p>
                  <div className="space-y-1">
                    <p className="text-gray-600">• "make it red"</p>
                    <p className="text-gray-600">• "make it larger"</p>
                    <p className="text-gray-600">• "add more padding"</p>
                    <p className="text-gray-600">• "add button"</p>
                    <p className="text-gray-600">• "change text to Hello World"</p>
                  </div>
                </div>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat Input - Fixed at bottom */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <form onSubmit={handleChatSubmit}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me to modify your component..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Middle Section - Properties & Code */}
          <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
            {/* Properties Panel */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-bold text-lg text-gray-200 mb-2">Properties</h3>
                {selectedElement && (
                  <p className="text-sm text-gray-400">
                    Editing: {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
                  </p>
                )}
              </div>
              
              <div className="p-4">
                {selectedElement ? (
                  <div>
                    <PropertyPanel
                      properties={selectedElement.properties}
                      onChange={updateProperties}
                      type={selectedElement.type}
                    />
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => {
                          const idx = elements.findIndex(e => e.id === selectedId);
                          const newElements = elements.filter(e => e.id !== selectedId);
                          setElements(newElements);
                          if (newElements.length > 0) {
                            setSelectedId(newElements[Math.max(0, idx - 1)].id);
                          }
                        }}
                      >
                        Delete Element
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>Select an element to edit its properties</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Elements Section */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <h4 className="font-semibold text-gray-200 mb-3">Add Elements</h4>
              <div className="grid grid-cols-2 gap-2">
                {ELEMENT_TYPES.map(el => (
                  <button
                    key={el.type}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-3 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
                    onClick={() => addElement(el.type)}
                  >
                    <span>{el.icon}</span>
                    <span>{el.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Code Editor & Preview */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="h-1/2 bg-gray-900 border-b border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-200">Code Editor</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Code Type:</span>
                    <div className="flex bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setCodeType("jsx")}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          codeType === "jsx" 
                            ? "bg-blue-600 text-white" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        JSX
                      </button>
                      <button
                        onClick={() => setCodeType("tsx")}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          codeType === "tsx" 
                            ? "bg-blue-600 text-white" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        TSX
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                  <div className="flex-1 p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">{codeType.toUpperCase()}</h4>
                    <div className="h-full">
                      <CodeEditor
                        value={code.jsx}
                        language={codeType === "tsx" ? "typescript" : "javascript"}
                        onChange={v => setCode(c => ({ ...c, jsx: v }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 border-l border-gray-800">
                    <h4 className="font-semibold text-gray-200 mb-2">CSS</h4>
                    <div className="h-full">
                      <CodeEditor
                        value={code.css}
                        language="css"
                        onChange={v => setCode(c => ({ ...c, css: v }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Export Buttons */}
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <h4 className="font-semibold text-gray-200 mb-3">Export</h4>
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    onClick={() => navigator.clipboard.writeText(code.jsx + "\n\n" + code.css)}
                  >
                    Copy Code
                  </button>
                  <button
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    onClick={async () => {
                      const zip = await import("jszip");
                      const JSZip = zip.default;
                      const zipFile = new JSZip();
                      const fileExtension = codeType === "tsx" ? "tsx" : "jsx";
                      zipFile.file(`Component.${fileExtension}`, code.jsx);
                      zipFile.file("styles.css", code.css);
                      
                      // Add TypeScript config for TSX
                      if (codeType === "tsx") {
                        const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}`;
                        zipFile.file("tsconfig.json", tsConfig);
                      }
                      
                      const blob = await zipFile.generateAsync({ type: "blob" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `component.${fileExtension}.zip`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download ZIP
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="h-1/2 bg-gray-900 flex flex-col">
              <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-200">Live Preview</h3>
                    <p className="text-sm text-gray-400">Click elements to select them</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">Live</span>
                    </div>
                    <button className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {elements.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-6">🎨</div>
                    <h3 className="text-lg font-semibold mb-2">No elements yet</h3>
                    <p className="text-sm mb-4">Add elements from the left panel to start building your component</p>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => addElement('button')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Add Button
                      </button>
                      <button 
                        onClick={() => addElement('card')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-2xl min-h-full relative overflow-hidden">
                    {/* Preview Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 ml-2">Preview</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {elements.length} element{elements.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {/* Preview Content */}
                    <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                      <div className="space-y-4">
                        {elements.map(el => {
                          const elementStyle = {
                            position: 'relative',
                            display: 'inline-block',
                          };
                          
                          if (el.type === "button") {
                            return (
                              <div key={el.id} style={elementStyle}>
                                <button
                                  style={{
                                    background: el.properties.color,
                                    fontSize: el.properties.fontSize,
                                    color: "#fff",
                                    padding: `${el.properties.padding || 12}px 24px`,
                                    margin: `${el.properties.margin || 0}px`,
                                    border: "none",
                                    borderRadius: el.properties.borderRadius || 6,
                                    boxShadow: el.properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                                    fontWeight: el.properties.fontWeight || "normal",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  className={`transition ${selectedId === el.id ? "ring-4 ring-blue-400" : ""}`}
                                  onClick={() => setSelectedId(el.id)}
                                >
                                  {el.properties.text}
                                </button>
                                {selectedId === el.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          if (el.type === "input") {
                            return (
                              <div key={el.id} style={elementStyle}>
                                <input
                                  placeholder={el.properties.placeholder}
                                  style={{
                                    background: "#fff",
                                    fontSize: el.properties.fontSize,
                                    color: el.properties.color,
                                    padding: `${el.properties.padding || 12}px 24px`,
                                    margin: `${el.properties.margin || 0}px`,
                                    border: "1px solid #ccc",
                                    borderRadius: el.properties.borderRadius || 6,
                                    boxShadow: el.properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                                    fontWeight: el.properties.fontWeight || "normal",
                                    display: "block",
                                    width: "100%",
                                    maxWidth: "300px",
                                    cursor: "pointer",
                                  }}
                                  className={`transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedId === el.id ? "ring-4 ring-blue-400" : ""}`}
                                  onClick={() => setSelectedId(el.id)}
                                />
                                {selectedId === el.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          if (el.type === "heading") {
                            return (
                              <div key={el.id} style={elementStyle}>
                                <h2
                                  style={{
                                    color: el.properties.color,
                                    fontSize: el.properties.fontSize,
                                    fontWeight: el.properties.fontWeight,
                                    margin: `${el.properties.margin || 0}px`,
                                    padding: `${el.properties.padding || 0}px`,
                                    display: "block",
                                    width: "100%",
                                    cursor: "pointer",
                                  }}
                                  className={`transition ${selectedId === el.id ? "ring-4 ring-blue-400" : ""}`}
                                  onClick={() => setSelectedId(el.id)}
                                >
                                  {el.properties.text}
                                </h2>
                                {selectedId === el.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          if (el.type === "card") {
                            return (
                              <div key={el.id} style={elementStyle}>
                                <div
                                  style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: el.properties.borderRadius || 12,
                                    padding: `${el.properties.padding || 24}px`,
                                    margin: `${el.properties.margin || 0}px`,
                                    background: "#fff",
                                    boxShadow: el.properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                                    maxWidth: "300px",
                                    width: "100%",
                                    display: "block",
                                    cursor: "pointer",
                                  }}
                                  className={`transition ${selectedId === el.id ? "ring-4 ring-blue-400" : ""}`}
                                  onClick={() => setSelectedId(el.id)}
                                >
                                  <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#171717" }}>
                                    {el.properties.title}
                                  </h3>
                                  <p style={{ fontSize: 16, color: "#444", margin: 0 }}>
                                    {el.properties.content}
                                  </p>
                                  {el.properties.image && (
                                    <img
                                      src={el.properties.image}
                                      alt="Card image"
                                      style={{ width: "100%", marginTop: 12, borderRadius: 8 }}
                                    />
                                  )}
                                </div>
                                {selectedId === el.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          if (el.type === "image") {
                            return (
                              <div key={el.id} style={elementStyle}>
                                <img
                                  src={el.properties.src}
                                  alt={el.properties.alt}
                                  style={{
                                    maxWidth: "100%",
                                    borderRadius: el.properties.borderRadius || 8,
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                    margin: `${el.properties.margin || 0}px`,
                                    padding: `${el.properties.padding || 0}px`,
                                    display: "block",
                                    width: "auto",
                                    cursor: "pointer",
                                  }}
                                  className={`transition ${selectedId === el.id ? "ring-4 ring-blue-400" : ""}`}
                                  onClick={() => setSelectedId(el.id)}
                                />
                                {selectedId === el.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Session Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Save Session</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter session name"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={async () => {
                  await saveSession();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 