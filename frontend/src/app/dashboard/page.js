"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import apiService from "../../services/api";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError("");
      try {
        const data = await apiService.getSessions();
        // The backend returns { sessions: [...], ... }
        setSessions(
          (data.sessions || []).map((s) => ({
            id: s._id || s.id,
            name: s.name,
            updated: s.lastModified || s.updated,
            elements: s.elements ? s.elements.length : 0,
            type: (s.tags && s.tags[0]) || "custom"
          }))
        );
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        
        // Fallback: try to load local sessions
        try {
          const localSessions = JSON.parse(localStorage.getItem('accio-sessions') || '[]');
          if (localSessions.length > 0) {
            setSessions(
              localSessions.map((s) => ({
                id: s.id,
                name: s.name,
                updated: s.lastModified || s.updated,
                elements: s.elements ? s.elements.length : 0,
                type: (s.tags && s.tags[0]) || "custom",
                isLocal: true
              }))
            );
            setError("Showing locally saved sessions. Backend is temporarily unavailable.");
          } else {
            setSessions([]);
            setError("Sessions are temporarily unavailable. You can still create new sessions in the playground.");
          }
        } catch (localError) {
          console.error('Failed to load local sessions:', localError);
          setSessions([]);
          setError("Sessions are temporarily unavailable. You can still create new sessions in the playground.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || session.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "landing": return "🏠";
      case "buttons": return "🔘";
      case "forms": return "📝";
      case "cards": return "🃏";
      default: return "📄";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "landing": return "bg-blue-500";
      case "buttons": return "bg-green-500";
      case "forms": return "bg-purple-500";
      case "cards": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) return;
    try {
      await apiService.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete session");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Manage your component sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/playground"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              + New Session
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{sessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Elements</p>
                <p className="text-2xl font-bold text-white">
                  {sessions.reduce((sum, session) => sum + session.elements, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Last Updated</p>
                <p className="text-2xl font-bold text-white">
                  {formatDate(sessions[0]?.updated).split(' ')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-white">
                  {sessions.filter(s => new Date(s.updated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Sessions
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search by session name..."
              />
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Type
              </label>
              <select
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="landing">Landing Pages</option>
                <option value="buttons">Buttons</option>
                <option value="forms">Forms</option>
                <option value="cards">Cards</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Your Sessions</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Loading sessions...</h3>
              <p className="text-gray-400 mb-6">
                Please wait while we fetch the component sessions.
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Sessions Temporarily Unavailable</h3>
              <p className="text-gray-400 mb-6">
                {error}
              </p>
              <Link
                href="/playground"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Create New Session
              </Link>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No sessions found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first component session"
                }
              </p>
              <Link
                href="/playground"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Create New Session
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(session.type)}/20`}>
                        <span className="text-2xl">{getTypeIcon(session.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {session.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{session.elements} elements</span>
                          <span>•</span>
                          <span>Updated {formatDate(session.updated)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-red-400 hover:text-white transition-colors"
                        onClick={() => handleDelete(session.id)}
                        title="Delete session"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <Link
                        href={`/playground?session=${session.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 