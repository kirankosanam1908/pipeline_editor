import type { Node, Edge, NodeProps } from 'reactflow';

// Node Types
export interface NodeData {
  label: string;
  type?: 'input' | 'process' | 'output';
  status?: 'active' | 'inactive' | 'error';
}

// Props Types
export interface CustomControlsProps {
  onAddNode: () => void;
  onAutoLayout: () => void;
  onClear: () => void;
}

export interface ValidationStatusProps {
  isValid: boolean;
  message: string;
}

export interface JsonPreviewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export type CustomNodeProps = NodeProps<NodeData>;