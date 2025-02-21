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

const pastelGreen = [180, 240, 200];
const pastelRed = [240, 150, 150];
const transitionRange = 10;

const initialNodes = [
  { id: '1', position: { x: 500, y: 0 }, data: { label: 'College' }, value: 50 },

  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Sciences' }, value: 60 },
  { id: '3', position: { x: 750, y: 100 }, data: { label: 'Arts' }, value: 55 },
  { id: '4', position: { x: 1250, y: 100 }, data: { label: 'Engineering' }, value: 65 },

  { id: '5', position: { x: 150, y: 200 }, data: { label: 'Math' }, value: 70 },
  { id: '6', position: { x: 350, y: 200 }, data: { label: 'Physics' }, value: 75 },
  { id: '7', position: { x: 550, y: 200 }, data: { label: 'Biology' }, value: 80 },
  { id: '8', position: { x: 750, y: 200 }, data: { label: 'History' }, value: 50 },
  { id: '9', position: { x: 950, y: 200 }, data: { label: 'Philosophy' }, value: 45 },
  { id: '10', position: { x: 1250, y: 200 }, data: { label: 'Computer Science' }, value: 85 },
  { id: '11', position: { x: 1450, y: 200 }, data: { label: 'Mechanical Eng' }, value: 78 },

  { id: '12', position: { x: 100, y: 300 }, data: { label: 'Calculus' }, value: 72 },
  { id: '13', position: { x: 300, y: 300 }, data: { label: 'Quantum Mechanics' }, value: 82 },
  { id: '14', position: { x: 500, y: 300 }, data: { label: 'Biochemistry' }, value: 79 },
  { id: '15', position: { x: 700, y: 300 }, data: { label: 'Ancient History' }, value: 53 },
  { id: '16', position: { x: 900, y: 300 }, data: { label: 'Ethics' }, value: 47 },
  { id: '17', position: { x: 1200, y: 300 }, data: { label: 'Software Eng' }, value: 88 },
  { id: '18', position: { x: 1400, y: 300 }, data: { label: 'Thermodynamics' }, value: 76 },

  { id: '19', position: { x: 100, y: 400 }, data: { label: 'Integration' }, value: 68 },
  { id: '20', position: { x: 300, y: 400 }, data: { label: 'Relativity' }, value: 85 },
  { id: '21', position: { x: 500, y: 400 }, data: { label: 'Genetics' }, value: 78 },
  { id: '22', position: { x: 700, y: 400 }, data: { label: 'Medieval History' }, value: 50 },
  { id: '23', position: { x: 900, y: 400 }, data: { label: 'Moral Philosophy' }, value: 52 },
  { id: '24', position: { x: 1200, y: 400 }, data: { label: 'Data Structures' }, value: 90 },
  { id: '25', position: { x: 1400, y: 400 }, data: { label: 'Fluid Mechanics' }, value: 74 },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },

  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e2-6', source: '2', target: '6' },
  { id: 'e2-7', source: '2', target: '7' },
  { id: 'e3-8', source: '3', target: '8' },
  { id: 'e3-9', source: '3', target: '9' },
  { id: 'e4-10', source: '4', target: '10' },
  { id: 'e4-11', source: '4', target: '11' },

  { id: 'e5-12', source: '5', target: '12' },
  { id: 'e6-13', source: '6', target: '13' },
  { id: 'e7-14', source: '7', target: '14' },
  { id: 'e8-15', source: '8', target: '15' },
  { id: 'e9-16', source: '9', target: '16' },
  { id: 'e10-17', source: '10', target: '17' },
  { id: 'e11-18', source: '11', target: '18' },

  { id: 'e12-19', source: '12', target: '19' },
  { id: 'e13-20', source: '13', target: '20' },
  { id: 'e14-21', source: '14', target: '21' },
  { id: 'e15-22', source: '15', target: '22' },
  { id: 'e16-23', source: '16', target: '23' },
  { id: 'e17-24', source: '17', target: '24' },
  { id: 'e18-25', source: '18', target: '25' },
];

const getNodeColor = (nodeValue, sliderValue) => {
  const diff = nodeValue - sliderValue;
  if (diff >= transitionRange) return `rgb(${pastelGreen.join(',')})`;
  if (diff <= -transitionRange) return `rgb(${pastelRed.join(',')})`;
  const blendFactor = (diff + transitionRange) / (2 * transitionRange);
  return `rgb(
    ${Math.round(pastelRed[0] + (pastelGreen[0] - pastelRed[0]) * blendFactor)},
    ${Math.round(pastelRed[1] + (pastelGreen[1] - pastelRed[1]) * blendFactor)},
    ${Math.round(pastelRed[2] + (pastelGreen[2] - pastelRed[2]) * blendFactor)}
  )`;
};

const SideMenu = ({ nodeName, setName, sliderValue, setSliderValue, addNewNode }) => (
  <div className="bg-white w-72 p-6 border-r border-gray-200 h-screen shadow-lg">
    <h2 className="text-2xl font-semibold mb-6">Controls</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add New Node</label>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter node name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={() => addNewNode(nodeName)}
          className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          Add Node
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Threshold: {sliderValue}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  </div>
);

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: { label: node.data.label, value: node.value },
      style: { 
        backgroundColor: getNodeColor(node.value, 50),
        borderRadius: '6px',
        padding: '10px',
        textAlign: 'left',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.1)',
      },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setName] = useState("");
  const [sliderValue, setSliderValue] = useState(50);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function addNewNode(nodeName) {
    if (!nodeName.trim()) {
      alert("Node name cannot be empty!");
      return;
    }
    const randomValue = Math.floor(Math.random() * 100);
    const newNode = {
      id: String(Date.now()),
      position: { x: 250, y: nodes.length * 100 },
      data: { label: `${nodeName} (${randomValue})` },
      value: randomValue,
      style: {
        backgroundColor: getNodeColor(randomValue, sliderValue),
        borderRadius: '6px',
        padding: '10px',
        textAlign: 'left',
        color: 'green',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.1)',
      },
    };
    setNodes([...nodes, newNode]);
    setName("");
  }

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { label: `${node.data.label.split(' ')[0]} (${node.value})` },
        style: {
          backgroundColor: getNodeColor(node.value, sliderValue),
          borderRadius: '6px',
          padding: '10px',
          textAlign: 'left',
          color: 'black',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.1)',
        },
      }))
    );
  }, [sliderValue, setNodes]);

  return (
    <div className="flex h-screen">
      <SideMenu 
        nodeName={nodeName}
        setName={setName}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        addNewNode={addNewNode}
      />
      
      <div className="flex-1 bg-gray-50 h-screen p-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}