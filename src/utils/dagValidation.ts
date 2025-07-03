import type { Node, Edge } from 'reactflow';
import type { NodeData, ValidationStatusProps } from '../types';

export const validateDAG = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): ValidationStatusProps => {
  // Check minimum nodes requirement
  if (nodes.length < 2) {
    return {
      isValid: false,
      message: 'At least 2 nodes are required',
    };
  }

  // Check if all nodes are connected
  const connectedNodes = new Set<string>();
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  if (connectedNodes.size < nodes.length) {
    return {
      isValid: false,
      message: 'All nodes must be connected',
    };
  }

  // Check for cycles using DFS
  const adjacencyList = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id) && hasCycle(node.id)) {
      return {
        isValid: false,
        message: 'Cycle detected in the graph',
      };
    }
  }

  return {
    isValid: true,
    message: 'Valid DAG structure',
  };
};