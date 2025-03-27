import React, { useState, useEffect } from "react";
import { Delaunay } from "d3-delaunay";
import { motion } from "framer-motion";

const generateGraph = (numNodes, width, height) => {
  let nodes = Array.from({ length: numNodes }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  let delaunay = Delaunay.from(
    nodes.map((n) => [n.x, n.y])
  );
  let edges = new Set();
  for (let i = 0; i < nodes.length; i++) {
    for (let j of delaunay.neighbors(i)) {
      edges.add([i, j].sort().toString());
    }
  }

  return {
    nodes,
    edges: Array.from(edges).map((e) => e.split(",").map(Number)),
    start: nodes[0],
    end: nodes[nodes.length - 1],
  };
};

const bfsPathfinding = (nodes, edges, start, end, setVisitedNodes, setDiscoveredEdges, setPath) => {
  let queue = [[nodes.indexOf(start)]];
  let visited = new Set();
  visited.add(nodes.indexOf(start));
  
  let discoveredEdges = new Set();

  let interval = setInterval(() => {
    if (queue.length === 0) {
      clearInterval(interval);
      setPath([]);
      return;
    }

    let path = queue.shift();
    let nodeIndex = path[path.length - 1];
    setVisitedNodes((prev) => new Set(prev).add(nodes[nodeIndex]));

    if (nodes[nodeIndex] === end) {
      clearInterval(interval);
      setPath(path.map((idx) => nodes[idx]));
      return;
    }

    for (let [a, b] of edges) {
      let neighbor = a === nodeIndex ? b : b === nodeIndex ? a : null;
      if (neighbor !== null && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
        
        let edgeKey = [nodeIndex, neighbor].sort().toString();
        discoveredEdges.add(edgeKey);
        setDiscoveredEdges(new Set(discoveredEdges));
      }
    }
  }, 50);
};

const PathfindingGraph = () => {
  const [graph, setGraph] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [discoveredEdges, setDiscoveredEdges] = useState(new Set());
  const [path, setPath] = useState([]);
  const width = 600, height = 400, numNodes = 100;

  useEffect(() => {
    setGraph(generateGraph(numNodes, width, height));
  }, []);

  const startPathfinding = () => {
    if (graph) {
      setVisitedNodes(new Set());
      setDiscoveredEdges(new Set());
      setPath([]);
      bfsPathfinding(graph.nodes, graph.edges, graph.start, graph.end, setVisitedNodes, setDiscoveredEdges, setPath);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-gray-200">
      <h3 className="text-4xl font-extrabold text-green-400 mb-4">
        Graph Pathfinding Visualizer
      </h3>
      <svg width={width} height={height} className="bg-gray-900 rounded-lg">
        {/* Edges */}
        {graph?.edges.map(([a, b], i) => {
          let { x: x1, y: y1 } = graph.nodes[a];
          let { x: x2, y: y2 } = graph.nodes[b];
          let edgeKey = [a, b].sort().toString();
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={discoveredEdges.has(edgeKey) ? "yellow" : "gray"}
              strokeWidth={discoveredEdges.has(edgeKey) ? "2" : "1"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}

        {/* Path */}
        {path.length > 1 &&
          path.map((node, i) =>
            i > 0 ? (
              <motion.line
                key={i}
                x1={path[i - 1].x}
                y1={path[i - 1].y}
                x2={node.x}
                y2={node.y}
                stroke="purple"
                strokeWidth="4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              />
            ) : null
          )}

        {/* Nodes */}
        {graph?.nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node === graph.start || node === graph.end ? 10 : 4}
            fill={node === graph.start ? "green" : node === graph.end ? "red" : visitedNodes.has(node) ? "yellow" : "white"}
            stroke="black"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </svg>
      <button
        onClick={startPathfinding}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg hover:bg-green-500"
      >
        Start
      </button>
    </div>
  );
};

export default PathfindingGraph;