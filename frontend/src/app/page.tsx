"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, BrainCircuit, Users, Eye, Database, LayoutDashboard, Settings, Compass } from 'lucide-react';

export default function LegacyOSDashboard() {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeMenu, setActiveMenu] = useState('board'); // 'board', 'simulation', 'memory'
  const [logs, setLogs] = useState<{agent: string, message: string, type: string}[]>([]);
  
  // Ref for auto-scrolling the chat
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startSimulation = async () => {
    if (!query.trim()) return;
    setIsSimulating(true);
    setLogs([]);
    
    // Select backend route based on active tab
    const endpoint = activeMenu === 'board' ? '/api/board-meeting' : '/api/simulate';
    const payload = activeMenu === 'board' ? { query } : { content: query };

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
    <div className="flex h-screen bg-[#FDFDFD] text-neutral-800 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-neutral-100">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-widest uppercase">LegacyOS</h1>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button onClick={() => setActiveMenu('board')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'board' ? 'bg-neutral-100 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
              <Users className="w-4 h-4" /> Shadow Board
            </button>
            <button onClick={() => setActiveMenu('simulation')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'simulation' ? 'bg-neutral-100 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
              <Eye className="w-4 h-4" /> Simulation Engine
            </button>
            <button onClick={() => setActiveMenu('memory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'memory' ? 'bg-neutral-100 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
              <Database className="w-4 h-4" /> Knowledge Graph
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-neutral-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-neutral-200 bg-white/50 backdrop-blur-md flex items-center px-8 justify-between shrink-0">
          <h2 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-neutral-400" />
            {activeMenu === 'board' ? 'Active Swarm: Board of Directors' : activeMenu === 'simulation' ? 'Active Environment: Digital Twins' : 'Memory: Vector Database'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-neutral-500 tracking-wide">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* Dashboard Layout */}
        <div className="flex-1 p-8 flex gap-8 overflow-hidden">
          
          {/* Left Column: Command & Logs (Fixed Height) */}
          <div className="w-1/3 flex flex-col gap-4 h-full min-w-[320px]">
            
            {/* The Live Streaming Log Window */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 flex-1 flex flex-col min-h-0 overflow-hidden relative">
              <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Execution Log</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-neutral-400 h-full flex items-center justify-center text-xs text-center">
                    Awaiting command payload...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex flex-col border-l-2 pl-3 py-1 ${log.agent === 'Orchestrator' ? 'border-neutral-900' : 'border-neutral-200'}`}
                    >
                      <span className="font-bold text-neutral-900 text-xs mb-1">{log.agent}</span>
                      <span className="text-neutral-600 leading-relaxed text-[13px]">{log.message}</span>
                    </motion.div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-white p-2 pl-5 rounded-2xl shadow-sm border border-neutral-200 flex items-center gap-3 shrink-0">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Deploy a strategy..."
                className="flex-1 bg-transparent outline-none text-sm text-neutral-900 placeholder-neutral-400"
                onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
              />
              <button 
                onClick={startSimulation}
                disabled={isSimulating}
                className="bg-neutral-900 text-white p-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visualization Canvas */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 flex flex-col relative overflow-hidden h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 z-10">
              {activeMenu === 'memory' ? '3D Knowledge Graph' : 'Simulation Canvas'}
            </h3>
            
            {/* Background Aesthetic */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
               <BrainCircuit className="w-[600px] h-[600px]" />
            </div>

            <div className="flex-1 z-10 flex flex-col items-center justify-center text-center">
               {activeMenu === 'memory' ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
                   <Database className="w-16 h-16 mx-auto mb-6 text-neutral-300" />
                   <h4 className="text-lg font-medium text-neutral-800 mb-2">Vector Memory Unavailable</h4>
                   <p className="text-sm text-neutral-500">Connect your Supabase pgvector instance to render your 3D Knowledge Graph nodes.</p>
                 </motion.div>
               ) : (
                 <div className="max-w-md">
                   {isSimulating ? (
                     <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                       <Users className="w-16 h-16 mx-auto mb-6 text-neutral-900" />
                       <h4 className="text-lg font-medium text-neutral-900 mb-2">Swarm Active</h4>
                       <p className="text-sm text-neutral-500">Agents are currently analyzing parameters and debating outcomes in real-time.</p>
                     </motion.div>
                   ) : (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       <LayoutDashboard className="w-16 h-16 mx-auto mb-6 text-neutral-300" />
                       <h4 className="text-lg font-medium text-neutral-800 mb-2">Canvas Idle</h4>
                       <p className="text-sm text-neutral-500">Submit a query to initialize the AI multi-agent swarm.</p>
                     </motion.div>
                   )}
                 </div>
               )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
