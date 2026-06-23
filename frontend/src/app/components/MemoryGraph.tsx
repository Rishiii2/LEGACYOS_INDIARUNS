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
    // Generate a consistent pseudo-random color based on node ID to keep it stable
    const seed = node.id ? node.id.length : Math.random() * 10;
    return seed % 2 === 0 ? '#3b82f6' : '#ffffff'; // Blue or White
  }, []);

  if (loading) {
    return <div className="text-neutral-500 text-sm">Loading Neural Graph...</div>;
  }

  if (graphData.nodes.length === 0) {
    return <div className="text-neutral-500 text-sm">Memory Graph is empty.</div>;
  }

  return (
    <div className="w-full h-[500px] flex items-center justify-center rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md shadow-inner shadow-black/20 border border-white/10">
      <ForceGraph3D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={getNodeColor}
        nodeRelSize={7}
        nodeOpacity={1}
        linkColor={() => 'rgba(220, 38, 38, 0.4)'}
        backgroundColor="rgba(0,0,0,0)"
        width={600}
        height={500}
      />
    </div>
  );
}
