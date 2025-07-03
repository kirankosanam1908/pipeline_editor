import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { CustomNodeProps } from '../../types';

interface NodeConfig {
  icon: React.ReactElement;
  primaryColor: string;
  secondaryColor: string;
  handleClass: string;
  borderClass: string;
  textClass: string;
  label: string;
}

const NodeComponent: React.FC<CustomNodeProps> = memo(({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const nodeConfigs: Record<string, NodeConfig> = {
    input: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      primaryColor: 'from-emerald-500 to-teal-600',
      secondaryColor: 'from-emerald-50 to-teal-50',
      handleClass: 'bg-emerald-500',
      borderClass: 'hover:border-emerald-300',
      textClass: 'text-emerald-700',
      label: 'Data Input'
    },
    process: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      ),
      primaryColor: 'from-blue-500 to-indigo-600',
      secondaryColor: 'from-blue-50 to-indigo-50',
      handleClass: 'bg-blue-500',
      borderClass: 'hover:border-blue-300',
      textClass: 'text-blue-700',
      label: 'Processing'
    },
    output: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      primaryColor: 'from-violet-500 to-purple-600',
      secondaryColor: 'from-violet-50 to-purple-50',
      handleClass: 'bg-violet-500',
      borderClass: 'hover:border-violet-300',
      textClass: 'text-violet-700',
      label: 'Output Result'
    }
  };

  const config = nodeConfigs[data.type || 'process'] || nodeConfigs.process;

  // Type guard for extended properties
  const extendedData = data as any;

  return (
    <div
      className={`relative group ${selected ? 'z-10' : 'z-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Ring */}
      {selected && (
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-75 blur-md animate-pulse" />
      )}

      {/* Main Node Container */}
      <div
        className={`
          relative overflow-hidden
          px-6 py-5 rounded-2xl
          bg-white
          border-2 transition-all duration-300 ease-out
          min-w-[240px] max-w-[280px]
          ${selected 
            ? 'border-transparent shadow-2xl scale-105' 
            : `border-gray-200 shadow-lg ${config.borderClass} hover:shadow-xl hover:scale-105`
          }
        `}
      >
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.secondaryColor}`}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Top Section - Type & Status */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`
              w-2 h-2 rounded-full bg-gradient-to-r ${config.primaryColor}
              ${isHovered || selected ? 'animate-pulse' : ''}
            `} />
            <span className={`
              text-xs font-semibold uppercase tracking-wider opacity-80
              ${config.textClass}
            `}>
              {config.label}
            </span>
          </div>
          
          {/* Node ID Badge */}
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            #{extendedData.id || 'node'}
          </span>
        </div>

        {/* Center Section - Icon & Label */}
        <div className="relative flex flex-col items-center text-center space-y-3">
          {/* Icon Container */}
          <div className={`
            relative p-4 rounded-2xl
            bg-gradient-to-br ${config.primaryColor}
            text-white shadow-lg
            transform transition-all duration-300
            ${isHovered || selected ? 'scale-110 rotate-3' : ''}
          `}>
            {config.icon}
            
            {/* Icon Glow Effect */}
            {(isHovered || selected) && (
              <div className={`
                absolute inset-0 rounded-2xl
                bg-gradient-to-br ${config.primaryColor}
                blur-xl opacity-50
              `} />
            )}
          </div>

          {/* Node Label */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {data.label || 'Untitled Node'}
            </h3>
            
            {/* Optional Description */}
            {extendedData.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {extendedData.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section - Metadata */}
        {(extendedData.metadata || isHovered) && (
          <div className={`
            mt-4 pt-3 border-t border-gray-100
            transition-all duration-300
            ${isHovered ? 'opacity-100' : 'opacity-60'}
          `}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {extendedData.metadata?.count || '0'} items
              </span>
              <span className="text-gray-500">
                {extendedData.metadata?.status || 'Ready'}
              </span>
            </div>
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t pointer-events-none
          transition-opacity duration-300
          ${isHovered 
            ? `${config.secondaryColor} opacity-10` 
            : 'from-transparent to-transparent opacity-0'
          }
        `} />
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className={`
          !w-5 !h-5 !border-2 !border-white !-left-2.5 !shadow-lg
          ${config.handleClass}
          transition-all duration-300
          hover:!scale-125 hover:!shadow-xl
          ${isHovered || selected ? '!scale-110' : ''}
        `}
        style={{
          background: config.handleClass.includes('emerald') ? '#10b981' : 
                     config.handleClass.includes('blue') ? '#3b82f6' : '#8b5cf6'
        }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className={`
          !w-5 !h-5 !border-2 !border-white !-right-2.5 !shadow-lg
          ${config.handleClass}
          transition-all duration-300
          hover:!scale-125 hover:!shadow-xl
          ${isHovered || selected ? '!scale-110' : ''}
        `}
        style={{
          background: config.handleClass.includes('emerald') ? '#10b981' : 
                     config.handleClass.includes('blue') ? '#3b82f6' : '#8b5cf6'
        }}
      />

      {/* Connection Guide Lines */}
      {isHovered && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-300" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-300" />
        </>
      )}

      {/* Interactive Tooltip */}
      {isHovered && extendedData.tooltip && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <div className="px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-xl">
              {extendedData.tooltip}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
});

NodeComponent.displayName = 'NodeComponent';

export default NodeComponent;