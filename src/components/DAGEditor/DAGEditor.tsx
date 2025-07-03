import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
  NodeTypes,
  useReactFlow,
} from 'reactflow';
import NodeComponent from '../NodeComponent/NodeComponent';
import CustomControls from '../Controls/CustomControls';
import ValidationStatus from '../ValidationStatus/ValidationStatus';
import JsonPreview from '../JsonPreview/JsonPreview';
import { validateDAG } from '../../utils/dagValidation';
import { getLayoutedElements } from '../../utils/layoutUtils';
import type { NodeData } from '../../types';

// Define nodeTypes outside component
const NODE_TYPES: NodeTypes = {
  custom: NodeComponent,
};

const INITIAL_NODES: Node<NodeData>[] = [
  {
    id: 'input-1',
    type: 'custom',
    data: { label: 'Input Node', type: 'input' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'process-1',
    type: 'custom',
    data: { label: 'Process Node', type: 'process' },
    position: { x: 300, y: 100 },
  },
];

const DAGEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>[]>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [validation, setValidation] = useState({ isValid: true, message: '' });
  const [isJsonPreviewOpen, setIsJsonPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) return;
      
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );

      if (!connectionExists) {
        setEdges((eds) => addEdge({
          ...params,
          animated: true,
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 2,
            strokeDasharray: '5,5'
          }
        }, eds));
      }
    },
    [edges, setEdges]
  );

  const handleAddNode = useCallback(() => {
    const nodeTypes = ['input', 'process', 'output'];
    const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
    const label = prompt('Enter node name:');
    
    if (label) {
      const newNode: Node<NodeData> = {
        id: `node_${Date.now()}`,
        type: 'custom',
        data: { label, type },
        position: { 
          x: Math.random() * 500, 
          y: Math.random() * 300 
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      setTimeout(() => fitView({ padding: 0.2 }), 0);
    }
  }, [setNodes, fitView]);

  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  const handleDeleteElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        handleDeleteElements();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteElements]);

  useEffect(() => {
    const result = validateDAG(nodes, edges);
    setValidation(result);
  }, [nodes, edges]);

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
      {/* Enhanced Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">DAG Editor</h1>
                <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">Design and validate your workflow</p>
              </div>
            </div>
            
            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-3">
                <CustomControls
                  onAddNode={handleAddNode}
                  onAutoLayout={handleAutoLayout}
                  onClear={handleClear}
                />
                <ValidationStatus {...validation} />
              </div>

              {/* Mobile Controls Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 
                         bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200
                         rounded-xl text-gray-700 font-medium text-sm
                         transition-all duration-200 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-200/50 space-y-3">
              <CustomControls
                onAddNode={handleAddNode}
                onAutoLayout={handleAutoLayout}
                onClear={handleClear}
              />
              <ValidationStatus {...validation} />
              <button
                onClick={() => setIsJsonPreviewOpen(true)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 
                         hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl 
                         font-medium text-sm transition-all duration-200 
                         flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View JSON
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Main Editor */}
        <div className="flex-1 relative min-h-[60vh] lg:min-h-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={NODE_TYPES}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
            snapToGrid={true}
            snapGrid={[15, 15]}
            deleteKeyCode={['Delete', 'Backspace']}
            className="bg-transparent"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1.5}
              color="#e2e8f0"
              className="opacity-60"
            />
            
            <Controls 
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-2xl m-4 overflow-hidden"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            
            {/* Enhanced Help Panel */}
            <Panel 
              position="bottom-left" 
              className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200/50 m-4 max-w-xs hidden sm:block"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Quick Guide</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {[
                    { icon: "🖱️", color: "text-blue-600"},
                    { icon: "🖱️", color: "text-blue-600", text: "Scroll to zoom" },
                    { icon: "✋", color: "text-green-600", text: "Drag to pan" },
                    { icon: "🗑️", color: "text-red-600", text: "Delete to remove" },
                    { icon: "🔗", color: "text-purple-600", text: "Drag handles to connect" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                      <span className={`text-lg ${item.color}`}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* Stats Panel */}
            <Panel 
              position="top-right" 
              className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200/50 m-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span>Statistics</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl">
                    <div className="text-xs text-blue-600 font-medium">Nodes</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">{nodes.length}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl">
                    <div className="text-xs text-green-600 font-medium">Edges</div>
                    <div className="text-2xl font-bold text-green-900 mt-1">{edges.length}</div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-xl ${
                  validation.isValid 
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100' 
                    : 'bg-gradient-to-r from-red-50 to-red-100'
                }`}>
                  <div className={`text-xs font-medium ${
                    validation.isValid ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    Status
                  </div>
                  <div className={`text-sm font-bold mt-1 ${
                    validation.isValid ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {validation.isValid ? 'Valid DAG' : 'Invalid DAG'}
                  </div>
                </div>
              </div>
            </Panel>

            {/* Mobile Stats Floating Button */}
            <Panel 
              position="top-right" 
              className="sm:hidden"
            >
              <button 
                className="bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-xl border border-gray-200/50 m-4"
                onClick={() => alert(`Nodes: ${nodes.length}\nEdges: ${edges.length}\nStatus: ${validation.isValid ? 'Valid' : 'Invalid'}`)}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </Panel>
          </ReactFlow>
        </div>

        {/* JSON Preview - Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 bg-white/80 backdrop-blur-xl border-l border-gray-200/50">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  JSON Preview
                </h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2))}
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <JsonPreview nodes={nodes} edges={edges} />
            </div>
          </div>
        </div>
      </div>

      {/* JSON Preview - Mobile Modal */}
      {isJsonPreviewOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden animate-slide-up sm:animate-scale-up">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                JSON Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2))}
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsJsonPreviewOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 88px)' }}>
              <JsonPreview nodes={nodes} edges={edges} />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes scale-up {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DAGEditor;                                         