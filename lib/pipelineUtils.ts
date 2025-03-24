// lib/pipelineUtils.ts
import { Edge, Node } from 'reactflow';

export interface PipelineValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a pipeline configuration
 */
export const validatePipeline = (nodes: Node[], edges: Edge[]): PipelineValidationResult => {
  const result: PipelineValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check if there are any nodes
  if (nodes.length === 0) {
    result.valid = false;
    result.errors.push('Pipeline has no nodes.');
    return result;
  }

  // Check if there are any data source nodes
  const hasDataSource = nodes.some((node) => node.type === 'dataSource');
  if (!hasDataSource) {
    result.valid = false;
    result.errors.push('Pipeline requires at least one data source node.');
  }

  // Check if there are any output nodes
  const hasOutput = nodes.some((node) => node.type === 'output');
  if (!hasOutput) {
    result.valid = false;
    result.errors.push('Pipeline requires at least one output node.');
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });
  
  const disconnectedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));
  if (disconnectedNodes.length > 0) {
    result.warnings.push(`${disconnectedNodes.length} disconnected node(s) found.`);
  }

  // Check for circular references
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });
  
  edges.forEach((edge) => {
    const targets = adjacencyList.get(edge.source) || [];
    targets.push(edge.target);
    adjacencyList.set(edge.source, targets);
  });
  
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  const checkCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (checkCycle(neighbor)) return true;
    }
    
    recursionStack.delete(nodeId);
    return false;
  };
  
  let hasCycle = false;
  for (const node of nodes) {
    if (!visited.has(node.id) && checkCycle(node.id)) {
      hasCycle = true;
      break;
    }
  }
  
  if (hasCycle) {
    result.valid = false;
    result.errors.push('Circular dependencies detected in pipeline. Please remove cycles.');
  }

  return result;
};

/**
 * Serializes a pipeline to JSON
 */
export const serializePipeline = (nodes: Node[], edges: Edge[]): string => {
  return JSON.stringify({ nodes, edges }, null, 2);
};

/**
 * Deserializes a pipeline from JSON
 */
export const deserializePipeline = (json: string): { nodes: Node[], edges: Edge[] } => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to parse pipeline JSON:', error);
    return { nodes: [], edges: [] };
  }
};