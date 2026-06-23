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
        if (data.nodes.length > 0) {
          // BFS to calculate depth from root node
          const rootId = data.nodes[0].id;
          const adjacency: Record<string, string[]> = {};
          
          data.nodes.forEach((n: any) => { 
            adjacency[n.id] = []; 
            n.depth = -1; 
          });
          
          data.links.forEach((l: any) => {
            if (adjacency[l.source]) adjacency[l.source].push(l.target);
            if (adjacency[l.target]) adjacency[l.target].push(l.source);
          });
          
          let queue = [{ id: rootId, depth: 0 }];
          data.nodes[0].depth = 0;
          
          while(queue.length > 0) {
            const curr = queue.shift()!;
            const neighbors = adjacency[curr.id] || [];
            neighbors.forEach(nid => {
              const neighborNode = data.nodes.find((n: any) => n.id === nid);
              if (neighborNode && neighborNode.depth === -1) {
                neighborNode.depth = curr.depth + 1;
                queue.push({ id: nid, depth: curr.depth + 1 });
              }
            });
          }
          
          // Fallback for unconnected nodes
          data.nodes.forEach((n: any) => {
            if (n.depth === -1) n.depth = 4;
          });
        }
        
        setGraphData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch memory graph:", err);
        setLoading(false);
      });
  }, []);

  const getNodeColor = useCallback((node: any) => {
    if (node.depth === 0) return '#ffffff'; // Center ball is white
    if (node.depth === 1) return '#7dd3fc'; // Sky blue
    if (node.depth === 2) return '#0ea5e9'; // Bright blue
    if (node.depth === 3) return '#0284c7'; // Deep blue
    return '#082f49'; // Very dark blue for farthest nodes
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
        nodeResolution={32}
        nodeOpacity={0.85}
        linkColor={() => 'rgba(156, 163, 175, 0.4)'}
        backgroundColor="rgba(0,0,0,0)"
        width={600}
        height={500}
      />
    </div>
  );
}
