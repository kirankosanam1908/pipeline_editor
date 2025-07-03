import React from 'react';
import type { CustomControlsProps } from '../../types';

const CustomControls: React.FC<CustomControlsProps> = ({
  onAddNode,
  onAutoLayout,
  onClear,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 w-full sm:w-auto max-w-full">
      {/* Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1 flex-1 sm:flex-initial">
        <button
          onClick={onAddNode}
          className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 
                     bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl 
                     shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                     transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 overflow-hidden"
          aria-label="Add new node"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          
          <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          
          <span className="hidden sm:inline relative z-10">Add Node</span>
          <span className="sm:hidden relative z-10">Add</span>
        </button>

        <button
          onClick={onAutoLayout}
          className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3
                     bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base
                     rounded-xl sm:rounded-2xl border border-gray-200 hover:border-gray-300
                     shadow-sm hover:shadow-md transform transition-all duration-200 
                     hover:-translate-y-0.5 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-gray-500/10"
          aria-label="Auto arrange layout"
        >
          <svg className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          
          <span className="hidden sm:inline">Auto Layout</span>
          <span className="sm:hidden">Layout</span>
        </button>
      </div>

      {/* Separator - Hidden on mobile */}
      <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent order-2" 
           aria-hidden="true" />

      {/* Secondary Actions */}
      <div className="flex items-center gap-2 order-1 sm:order-3 ml-auto sm:ml-0">
        <button
          onClick={onClear}
          className="group relative p-2.5 sm:p-3 text-red-600 hover:text-red-700 
                     bg-white hover:bg-red-50 rounded-xl sm:rounded-2xl
                     border border-red-200/50 hover:border-red-300
                     shadow-sm hover:shadow-md transform transition-all duration-200
                     hover:-translate-y-0.5 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-red-500/10"
          aria-label="Clear all nodes and edges"
          title="Clear all"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Additional Actions - Hidden on small mobile */}
        <div className="hidden xs:flex items-center gap-2">
          <button
            className="group relative p-2.5 sm:p-3 text-gray-500 hover:text-gray-700
                       bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl
                       border border-gray-200/50 hover:border-gray-300
                       shadow-sm hover:shadow-md transform transition-all duration-200
                       hover:-translate-y-0.5 active:translate-y-0
                       focus:outline-none focus:ring-4 focus:ring-gray-500/10"
            aria-label="Fit view to content"
            title="Fit view"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          <button
            className="group relative p-2.5 sm:p-3 text-gray-500 hover:text-gray-700
                       bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl
                       border border-gray-200/50 hover:border-gray-300
                       shadow-sm hover:shadow-md transform transition-all duration-200
                       hover:-translate-y-0.5 active:translate-y-0
                       focus:outline-none focus:ring-4 focus:ring-gray-500/10"
            aria-label="Export workflow"
            title="Export"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden order-4 w-full mt-2 px-4 py-2.5 
                   bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200
                   text-gray-700 font-medium text-sm rounded-xl
                   border border-gray-200 shadow-sm
                   transform transition-all duration-200 active:scale-[0.98]
                   focus:outline-none focus:ring-4 focus:ring-gray-500/10
                   flex items-center justify-center gap-2"
        aria-label="More options"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" 
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        <span>More Options</span>
      </button>
    </div>
  );
};

export default CustomControls;