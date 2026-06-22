"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, BrainCircuit, Users, Eye, Database } from 'lucide-react';

export default function LegacyOSCanvas() {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeMode, setActiveMode] = useState('board'); // 'board', 'simulation', 'memory'
  const [logs, setLogs] = useState<{agent: string, message: string, type: string}[]>([]);

  const startSimulation = async () => {
    if (!query.trim()) return;
    setIsSimulating(true);
    setLogs([]);
    
    // Choose endpoint based on mode
    const endpoint = activeMode === 'board' ? '/api/board-meeting' : '/api/simulate';
    const payload = activeMode === 'board' ? { query } : { content: query };

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              setIsSimulating(false);
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              setLogs(prev => [...prev, { 
                agent: parsed.agent || parsed.persona || 'System', 
                message: parsed.message,
                type: parsed.event
              }]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.error(e);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-neutral-900" />
          <h1 className="text-xl font-bold tracking-tight">LegacyOS</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveMode('board')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeMode === 'board' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}>
            <Users className="w-4 h-4" /> Board Room
          </button>
          <button onClick={() => setActiveMode('simulation')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeMode === 'simulation' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}>
            <Eye className="w-4 h-4" /> Digital Twins
          </button>
          <button onClick={() => setActiveMode('memory')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeMode === 'memory' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}>
            <Database className="w-4 h-4" /> Memory Graph
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[70vh]">
        
        {/* Left Column: Command & Logs */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex-1 overflow-y-auto flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Live Execution</h2>
            <div className="flex-1 flex flex-col gap-3 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-neutral-400 mt-auto mb-auto text-center">Awaiting command...</div>
              ) : (
                logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className="flex flex-col border-l-2 border-neutral-200 pl-3 py-1"
                  >
                    <span className="font-bold text-neutral-900">{log.agent}</span>
                    <span className="text-neutral-600">{log.message}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Input Box */}
          <div className="bg-white p-2 pl-4 rounded-full shadow-sm border border-neutral-200 flex items-center gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Deploy a strategy or command the swarm..."
              className="flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-400"
              onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
            />
            <button 
              onClick={startSimulation}
              disabled={isSimulating}
              className="bg-neutral-900 text-white p-2 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Visualization Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 z-10">
            {activeMode === 'memory' ? '3D Knowledge Graph' : 'Simulation Canvas'}
          </h2>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
             <BrainCircuit className="w-96 h-96" />
          </div>

          <div className="flex-1 z-10 flex items-center justify-center">
             {activeMode === 'memory' ? (
               <div className="text-center text-neutral-500">
                 <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <p>3D Vector Memory Visualization</p>
                 <p className="text-sm mt-2">Connect to Supabase pgvector to render nodes.</p>
               </div>
             ) : (
               <div className="text-center text-neutral-500">
                 {isSimulating ? (
                   <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                     <Users className="w-12 h-12 mx-auto mb-4 text-neutral-900" />
                     <p className="font-medium text-neutral-900">Swarm Active</p>
                   </motion.div>
                 ) : (
                   <div>
                     <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                     <p>Canvas Idle</p>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>

      </main>
    </div>
  );
}
