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
    return '#10b981'; // Bright emerald for all nodes to give a glowing matrix effect
  }, []);

  if (loading) {
    return <div className="text-neutral-500 text-sm">Loading Neural Graph...</div>;
  }

  if (graphData.nodes.length === 0) {
    return <div className="text-neutral-500 text-sm">Memory Graph is empty.</div>;
  }

  return (
    <div className="w-full h-[500px] flex items-center justify-center rounded-2xl overflow-hidden bg-[#0E0E10] shadow-inner shadow-black/50 border border-neutral-800">
      <ForceGraph3D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={getNodeColor}
        nodeRelSize={7}
        nodeOpacity={0.9}
        linkColor={() => 'rgba(16, 185, 129, 0.25)'}
        backgroundColor="#0E0E10"
        width={600}
        height={500}
      />
    </div>
  );
}
