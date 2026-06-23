"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';

// Force Graph 3D needs to be loaded only on the client side
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function MemoryGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${baseUrl}/api/memory/graph`)
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch memory graph:", err);
        setLoading(false);
      });
  }, []);

  const getNodeColor = useCallback((node: any) => {
    const colors: Record<string, string> = {
      person: '#3b82f6', // blue
      project: '#10b981', // emerald
      goal: '#f59e0b', // amber
      skill: '#8b5cf6', // purple
      market: '#ec4899', // pink
    };
    return colors[node.group] || '#9ca3af'; // gray default
  }, []);

  if (loading) {
    return <div className="text-neutral-500 text-sm">Loading Neural Graph...</div>;
  }

  if (graphData.nodes.length === 0) {
    return <div className="text-neutral-500 text-sm">Memory Graph is empty.</div>;
  }

  return (
    <div className="w-full h-[500px] flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-900 shadow-inner">
      <ForceGraph3D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={getNodeColor}
        nodeRelSize={6}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        backgroundColor="#171717"
        width={600}
        height={500}
      />
    </div>
  );
}
