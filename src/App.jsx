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
  { id: '1', position: { x: 500, y: 0 }, data: { label: 'College' }, value: 60, teacher: 'John' },

  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Sciences' }, value: 60, teacher: 'Alice' },
  { id: '3', position: { x: 750, y: 100 }, data: { label: 'Arts' }, value: 55, teacher: 'Bruno' },
  { id: '4', position: { x: 1250, y: 100 }, data: { label: 'Engineering' }, value: 65, teacher: 'Chloe' },

  { id: '5', position: { x: 150, y: 200 }, data: { label: 'Math' }, value: 70, teacher: 'David' },
  { id: '6', position: { x: 350, y: 200 }, data: { label: 'Physics' }, value: 75, teacher: 'Elena' },
  { id: '7', position: { x: 550, y: 200 }, data: { label: 'Biology' }, value: 80, teacher: 'Felix' },
  { id: '8', position: { x: 750, y: 200 }, data: { label: 'History' }, value: 50, teacher: 'Grace' },
  { id: '9', position: { x: 950, y: 200 }, data: { label: 'Philosophy' }, value: 45, teacher: 'Henry' },
  { id: '10', position: { x: 1250, y: 200 }, data: { label: 'Computer Science' }, value: 85, teacher: 'Jonah' },
  { id: '11', position: { x: 1450, y: 200 }, data: { label: 'Mechanical Eng' }, value: 78, teacher: 'Kelly' },

  { id: '12', position: { x: 100, y: 300 }, data: { label: 'Calculus' }, value: 72, teacher: 'Liam' },
  { id: '13', position: { x: 300, y: 300 }, data: { label: 'Quantum Mechanics' }, value: 82, teacher: 'Molly' },
  { id: '14', position: { x: 500, y: 300 }, data: { label: 'Biochemistry' }, value: 79, teacher: 'Nolan' },
  { id: '15', position: { x: 700, y: 300 }, data: { label: 'Ancient History' }, value: 53, teacher: 'Olive' },
  { id: '16', position: { x: 900, y: 300 }, data: { label: 'Ethics' }, value: 47, teacher: 'Pete' },
  { id: '17', position: { x: 1200, y: 300 }, data: { label: 'Software Eng' }, value: 88, teacher: 'Barry' },
  { id: '18', position: { x: 1400, y: 300 }, data: { label: 'Thermodynamics' }, value: 76, teacher: 'Bill' },

  { id: '19', position: { x: 100, y: 400 }, data: { label: 'Integration' }, value: 68, teacher: 'Simon' },
  { id: '20', position: { x: 300, y: 400 }, data: { label: 'Relativity' }, value: 85, teacher: 'Pete' },
  { id: '21', position: { x: 500, y: 400 }, data: { label: 'Genetics' }, value: 78, teacher: 'Mike' },
  { id: '22', position: { x: 700, y: 400 }, data: { label: 'Medieval History' }, value: 50, teacher: 'Matthew' },
  { id: '23', position: { x: 900, y: 400 }, data: { label: 'Moral Philosophy' }, value: 52, teacher: 'Ned' },
  { id: '24', position: { x: 1200, y: 400 }, data: { label: 'Data Structures' }, value: 90, teacher: 'Oscar' },
  { id: '25', position: { x: 1400, y: 400 }, data: { label: 'Fluid Mechanics' }, value: 74, teacher: 'Kevin' },
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

const getNodeColor = (nodeValue, sliderValue, baseColour,failColour,transRange) => {
  const diff = nodeValue - sliderValue;
  if (diff >= transRange) return `rgb(${baseColour.join(',')})`;
  if (diff <= -transRange) return `rgb(${failColour.join(',')})`;
  const blendFactor = (diff + transRange) / (2 * transRange);
  return `rgb(
    ${Math.round(failColour[0] + (baseColour[0] - failColour[0]) * blendFactor)},
    ${Math.round(failColour[1] + (baseColour[1] - failColour[1]) * blendFactor)},
    ${Math.round(failColour[2] + (baseColour[2] - failColour[2]) * blendFactor)}
  )`;
};

const SideMenu = ({ nodeName, setName, sliderValue, setSliderValue, addNewNode, randValues, setGood,setFail,setTrans }) => {

  function hexToRgb(hex) {
    return hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16))
  }

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 p-6 shadow-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Provider Health</h2>
          <p className="text-sm text-gray-500 mt-1">
            View your college performance
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add New Node
            </label>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter node name"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />


            <button
              onClick={() => addNewNode(nodeName)}
              className="w-full mt-2 bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium shadow-sm"
            >
              Add Node
            </button>
            <label className="block text-sm font-medium text-gray-700 pt-4">
              Choose Metric
            </label>
            <select
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              onChange={() => randValues()}
            >
              <option value="">Performance Indicator</option>
              <option value="metric1">Attendance</option>
              <option value="metric2">Achievement</option>
              <option value="metric3">Withdrawal Rate</option>
            </select>
          </div>

          <div className="space-y-2 pt-4">
            <label className="block text-sm font-medium text-gray-700">
              Threshold (%) : {sliderValue}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 pt-4 cursor-pointer flex items-center"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              >
                Advanced
                <span className="ml-2">
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </label>
              {isAdvancedOpen && (
                <div className="mt-2">
                  <label className='block text-sm font-medium text-gray-700'>Threshold Boundary</label>
                  <input className='pt-2 pb-2 text-sm text-gray-700'type='number' defaultValue={10} onChange={(e)=>setTrans(Number(e.target.value))} ></input>
                  <br/>
                  <label className='pb-1 pt-6 font-medium text-gray-700'>Positive Colour</label>
                  <br/>
                  <input type='color' defaultValue="#b4f0c8" onChange={(e)=>setGood(hexToRgb(e.target.value))} ></input>
                  <br/>
                  <label className='pb-1 pt-2 font-medium text-gray-700'>Negative Colour</label>
                  <br/>
                  <input type='color' defaultValue="#f09696" onChange={(e)=>setFail(hexToRgb(e.target.value))} ></input>
                 
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {

  const [baseColour, setBaseColour] = useState([180, 240, 200]);
  const [failColour, setFailColour] = useState([240, 150, 150]);
  const [transRange, setTransitionRange] = useState(10);


  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: {
        label: (
          <div className="flex flex-col">
            <div className="font-medium">{node.data.label}</div>
            <div className="text-sm mt-1">{node.value}%</div>
          </div>
        ),
        value: node.value
      },
      style: {
        backgroundColor: getNodeColor(node.value, 50,baseColour,failColour,transRange),
        borderRadius: '0.75rem',
        padding: '0.75rem',
        minWidth: '160px',
        textAlign: 'left',
        color: '#1a1a1a',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(edge => ({
      ...edge,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
      },
    }))
  );

  const [nodeName, setName] = useState("");
  const [sliderValue, setSliderValue] = useState(50);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function randValues() {
    setNodes((nds) =>
      nds.map((node) => {
        const randomValue = Math.floor(Math.random() * 100); // Generate random value for each node
        return {
          ...node,
          data: {
            label: (
              <div className="flex flex-col">
                <div className="font-medium">
                  {node.data.label.props?.children[0].props?.children || node.data.label}
                </div>
                <div className="font-medium mt-1">{randomValue}%</div>
                <div className="mt-1 font-medium">{node.teacher}</div>
              </div>
            ),
            value: randomValue // Store the random value in data.value
          },
          style: {
            backgroundColor: getNodeColor(randomValue, sliderValue,baseColour,failColour,transRange),
            borderRadius: '0.75rem',
            padding: '0.75rem',
            minWidth: '160px',
            textAlign: 'left',
            color: '#1a1a1a',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          },
        };
      })
    );
  }
  function addNewNode(nodeName) {
    if (!nodeName.trim()) {
      alert("Node name cannot be empty!");
      return;
    }
    const randomValue = Math.floor(Math.random() * 100);
    const newNode = {
      id: String(Date.now()),
      position: { x: 250, y: nodes.length * 100 },
      data: {
        label: (
          <div className="flex flex-col">
            <div className="font-medium">{nodeName}</div>
            <div className="text-sm mt-1">{randomValue}%</div>
          </div>
        ),
        value: randomValue
      },
      style: {
        backgroundColor: getNodeColor(randomValue, sliderValue,baseColour,failColour,transRange),
        borderRadius: '0.75rem',
        padding: '0.75rem',
        minWidth: '160px',
        textAlign: 'left',
        color: '#1a1a1a',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    };
    setNodes([...nodes, newNode]);
    setName("");
  }

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          label: (
            <div className="flex flex-col">
              <div className="font-medium">{node.data.label.props?.children[0].props?.children || node.data.label}</div>
              <div className="font-medium mt-1">{node.data.value}%</div>
              <div className='mt-1 font-medium'>{node.teacher}</div>
            </div>
          ),
          value: node.data.value
        },
        style: {
          backgroundColor: getNodeColor(node.data.value, sliderValue,baseColour,failColour,transRange),
          borderRadius: '0.75rem',
          padding: '0.75rem',
          minWidth: '160px',
          textAlign: 'left',
          color: '#1a1a1a',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      }))
    );
  }, [sliderValue,baseColour,failColour,transRange, setNodes]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SideMenu
        nodeName={nodeName}
        setName={setName}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        addNewNode={addNewNode}
        randValues={randValues}
        setGood={setBaseColour}
        setFail={setFailColour}
        setTrans={setTransitionRange}
      />

      <div className="flex-1 h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls className="bg-white border border-gray-200 shadow-sm rounded-lg" />
          <MiniMap className="bg-white border border-gray-200 shadow-sm rounded-lg" />
          <Background
            variant="dots"
            gap={12}
            size={1}
            color="#94a3b8"
          />
        </ReactFlow>
      </div>
    </div>
  );
}