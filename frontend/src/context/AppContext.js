"use client";

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [chat, setChat] = useState([]); // [{role: 'user'|'ai', content: '...'}]
  const [code, setCode] = useState({ jsx: "", css: "" });
  const [uiState, setUiState] = useState({}); // for property panel, etc.
  const [session, setSession] = useState(null); // current session/work

  return (
    <AppContext.Provider value={{ chat, setChat, code, setCode, uiState, setUiState, session, setSession }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
} 