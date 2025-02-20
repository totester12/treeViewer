import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import './app.css';
import '@xyflow/react/dist/style.css';

const pastelGreen = [10, 80, 40]; // RGB forrgb(10, 83, 47)
const pastelRed = [100, 10, 10];   // RGB forrgb(112, 11, 11)

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'College' }, value: 20 },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Maths' }, value: 60 },
  { id: '3', position: { x: 0, y: 200 }, data: { label: 'Science' }, value: 90 },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' }
];

// More aggressive color transition calculation
const getNodeColor = (nodeValue, sliderValue) => {
  if (nodeValue >= sliderValue) return `rgb(${pastelGreen.join(',')})`; // Full green quickly

  // More aggressive transition to red (quadratic effect)
  let blendFactor = (sliderValue - nodeValue) / sliderValue;
  blendFactor = blendFactor ** 2; // Quadratic effect for harsher transition

  return `rgb(
    ${Math.round(pastelGreen[0] + (pastelRed[0] - pastelGreen[0]) * blendFactor)},
    ${Math.round(pastelGreen[1] + (pastelRed[1] - pastelGreen[1]) * blendFactor)},
    ${Math.round(pastelGreen[2] + (pastelRed[2] - pastelGreen[2]) * blendFactor)}
  )`;
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: { label: `${node.data.label} (${node.value})` }, // Label includes value
      style: { backgroundColor: getNodeColor(node.value, 50) }, // Default threshold 50
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setName] = useState("");
  const [sliderValue, setSliderValue] = useState(50); // Default threshold

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function addNewNode(nodeName) {
    if (!nodeName.trim()) {
      alert("Node name cannot be empty!");
      return;
    }
    const randomValue = Math.floor(Math.random() * 100); // Random value for new node
    const newNode = {
      id: String(Date.now()),
      position: { x: 0, y: nodes.length * 100 },
      data: { label: `${nodeName} (${randomValue})` }, // Label includes value
      value: randomValue,
      style: { backgroundColor: getNodeColor(randomValue, sliderValue) }, // Apply color based on threshold
    };
    setNodes([...nodes, newNode]);
    setName("");
  }

  // Update all node colors & labels when slider changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { label: `${node.data.label.split(' ')[0]} (${node.value})` }, // Update label with current value
        style: { backgroundColor: getNodeColor(node.value, sliderValue) },
      }))
    );
  }, [sliderValue, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh', padding: '10px' }}>
      <input
        type="text"
        value={nodeName}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter node name"
      />
      <button onClick={() => addNewNode(nodeName)}>Add Node</button>

      <div style={{ marginTop: '10px' }}>
        <label>Threshold Slider:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
        />
        <span> {sliderValue}</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
