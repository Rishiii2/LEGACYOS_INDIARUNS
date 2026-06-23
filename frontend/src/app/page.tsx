"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, BrainCircuit, Users, Eye, Database, LayoutDashboard, Settings, Compass } from 'lucide-react';
import MemoryGraph from './components/MemoryGraph';

export default function LegacyOSDashboard() {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeMenu, setActiveMenu] = useState('board'); // 'board', 'simulation', 'memory'
  const [logs, setLogs] = useState<any[]>([]);
  
  // Ref for auto-scrolling the chat
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startSimulation = async () => {
    if (!query.trim()) return;
    setIsSimulating(true);
    setLogs([]);
    const savedQuery = query;
    setQuery('');
    
    // Select backend route based on active tab
    const endpoint = activeMenu === 'board' ? '/api/board-meeting' : '/api/simulate';
    const payload = activeMenu === 'board' ? { query: savedQuery } : { content: savedQuery };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}${endpoint}`, {
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
    <div className="flex h-screen bg-[#0A0A0B] text-neutral-200 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-2xl flex flex-col justify-between hidden md:flex z-50 shadow-xl shadow-black/20">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BrainCircuit className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-white drop-shadow-md">LegacyOS</h1>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button onClick={() => setActiveMenu('board')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'board' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Shadow Board
            </button>
            <button onClick={() => setActiveMenu('simulation')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'simulation' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
              <Eye className="w-4 h-4" /> Digital Twins
            </button>
            <button onClick={() => setActiveMenu('memory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'memory' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
              <Database className="w-4 h-4" /> Knowledge Graph
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:bg-white/5 hover:text-white">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-2xl flex items-center px-8 justify-between shrink-0 z-40 shadow-sm shadow-black/10">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
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
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/20 border border-white/10 flex-1 flex flex-col min-h-0 overflow-hidden relative">
              <div className="px-5 py-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200/80">Execution Log</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-sm">
                
                {/* Instructional Manual */}
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                  <h4 className="text-emerald-400 font-bold text-xs uppercase mb-1 drop-shadow-sm">
                    {activeMenu === 'board' ? 'Shadow Board Mode' : 'Digital Twins Mode'}
                  </h4>
                  <p className="text-emerald-100/80 text-xs leading-relaxed">
                    {activeMenu === 'board' 
                      ? 'Simulates a 4-person executive board to pressure-test your strategy. Type a major decision below (e.g. "Should we pivot to AI?").'
                      : 'Simulates 10 diverse consumer personas reading your marketing copy. Paste an ad or product pitch below to A/B test your messaging.'}
                  </p>
                </div>

                {logs.length === 0 ? (
                  <div className="text-neutral-500 h-32 flex items-center justify-center text-xs text-center">
                    Awaiting command payload...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex flex-col border-l-2 pl-3 py-1 ${log.agent === 'Orchestrator' ? 'border-emerald-500' : 'border-neutral-700'}`}
                    >
                      <span className="font-bold text-neutral-200 text-xs mb-1">{log.agent || log.persona || 'System'}</span>
                      <span className="text-neutral-400 leading-relaxed text-[13px]">{log.message}</span>
                    </motion.div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-white/5 backdrop-blur-xl p-2 pl-5 rounded-2xl shadow-xl shadow-black/20 border border-white/10 flex items-center gap-3 shrink-0 focus-within:border-emerald-400/50 transition-colors">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Deploy a strategy or pitch..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-emerald-200/50"
                onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
              />
              <button 
                onClick={startSimulation}
                disabled={isSimulating}
                className="bg-emerald-500 text-black p-3 rounded-xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visualization Canvas */}
          <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-xl shadow-black/20 border border-white/10 p-8 flex flex-col relative overflow-hidden h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200/80 mb-6 z-10">
              {activeMenu === 'memory' ? '3D Knowledge Graph' : 'Simulation Canvas'}
            </h3>
            
            {/* Background Aesthetic */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
               <BrainCircuit className="w-[600px] h-[600px] text-emerald-200" />
            </div>

            <div className="flex-1 z-10 flex flex-col w-full h-full overflow-hidden">
               {activeMenu === 'memory' ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-center">
                   <MemoryGraph />
                   <p className="mt-4 text-xs text-neutral-600 font-mono bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">Drag to rotate • Scroll to zoom</p>
                 </div>
               ) : (
                 <div className="w-full h-full overflow-y-auto">
                   {logs.filter(l => l.type === 'speak' || l.type === 'reaction' || l.type === 'resolution' || l.type === 'finish').length > 0 ? (
                     <div className={`grid gap-4 auto-rows-max pb-10 ${activeMenu === 'board' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                       {logs.filter(l => l.type === 'speak' || l.type === 'reaction' || l.type === 'resolution' || l.type === 'finish').map((log, idx) => (
                         <motion.div 
                           key={idx} 
                           initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           className={activeMenu === 'board' ? (
                             `p-5 rounded-xl border backdrop-blur-md ${log.type === 'resolution' || log.type === 'finish' ? 'col-span-full bg-emerald-500/10 border-emerald-400/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'bg-white/5 border-white/10'}`
                           ) : (
                             `flex items-center gap-4 p-4 rounded-full border bg-white/5 backdrop-blur-md border-white/10 shadow-lg shadow-black/10`
                           )}
                         >
                           {activeMenu === 'simulation' && (
                             <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-400/30">
                               <Users className="w-5 h-5 text-emerald-400" />
                             </div>
                           )}
                           <div className="flex-1 min-w-0">
                             <h5 className={`font-bold text-sm mb-1 ${log.type === 'resolution' || log.type === 'finish' ? 'text-emerald-400' : 'text-white drop-shadow-sm'}`}>
                               {log.agent || log.persona || 'System Orchestrator'}
                             </h5>
                             <p className="text-xs text-emerald-100/70 leading-relaxed truncate whitespace-normal line-clamp-2">{log.message}</p>
                           </div>
                         </motion.div>
                       ))}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                       {isSimulating ? (
                         <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                           <Users className="w-16 h-16 mx-auto mb-6 text-emerald-400 opacity-80" />
                           <h4 className="text-lg font-medium text-white mb-2 drop-shadow-sm">Swarm Active</h4>
                           <p className="text-sm text-emerald-200/60">Agents are currently analyzing parameters and debating outcomes in real-time.</p>
                         </motion.div>
                       ) : (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           <LayoutDashboard className="w-16 h-16 mx-auto mb-6 text-white/20" />
                           <h4 className="text-lg font-medium text-white/70 mb-2">Canvas Idle</h4>
                           <p className="text-sm text-emerald-200/40">Submit a query to initialize the AI multi-agent swarm.</p>
                         </motion.div>
                       )}
                     </div>
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
