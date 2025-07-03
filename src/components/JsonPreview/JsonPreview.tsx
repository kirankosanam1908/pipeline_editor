import React, { useState } from 'react';
import type { JsonPreviewProps } from '../../types';

const JsonPreview: React.FC<JsonPreviewProps> = ({ nodes, edges }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'nodes' | 'edges'>('all');
  const [isCopied, setIsCopied] = useState(false);

  const data = {
    nodes: nodes.map(({ id, data, position }) => ({ id, data, position })),
    edges: edges.map(({ id, source, target }) => ({ id, source, target })),
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'nodes':
        return { nodes: data.nodes };
      case 'edges':
        return { edges: data.edges };
      default:
        return data;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getTabContent(), null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dag-structure-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Desktop version for sidebar
  if (!isExpanded && typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-gray-50/50 to-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">JSON Structure</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group relative"
                title="Copy JSON"
              >
                {isCopied ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                title="Download JSON"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['all', 'nodes', 'edges'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 capitalize
                  ${activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-4">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(getTabContent(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Nodes:</span>
              <span className="font-medium text-gray-900 bg-blue-100 px-2 py-0.5 rounded-full">{nodes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Edges:</span>
              <span className="font-medium text-gray-900 bg-green-100 px-2 py-0.5 rounded-full">{edges.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile floating version
  return (
    <div className={`
      fixed bottom-4 right-4 z-40
      bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl 
      transition-all duration-300 ease-out
      border border-gray-200/50
      ${isExpanded ? 'w-[calc(100vw-2rem)] sm:w-[400px] h-[60vh] sm:h-[500px]' : 'w-auto h-auto'}
    `}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors duration-200"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">DAG Structure</div>
            <div className="text-xs text-gray-500">{nodes.length} nodes, {edges.length} edges</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <>
          {/* Expanded Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">JSON Preview</h3>
                <p className="text-xs text-gray-500">{nodes.length} nodes, {edges.length} edges</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
              >
                {isCopied ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 pt-3">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {(['all', 'nodes', 'edges'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize
                    ${activeTab === tab 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* JSON Content */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="text-xs sm:text-sm font-mono text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(getTabContent(), null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JsonPreview;