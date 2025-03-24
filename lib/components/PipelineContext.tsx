/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { Edge, Node } from "reactflow";

interface ApiKeys {
  openai?: string;
}

interface PipelineContextType {
  apiKeys: ApiKeys;
  setApiKey: (provider: keyof ApiKeys, key: string) => void;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  pipelineResults: any;
  setPipelineResults: React.Dispatch<React.SetStateAction<any>>;
  isExecuting: boolean;
  setIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
}

const PipelineContext = createContext<PipelineContextType | undefined>(
  undefined,
);

export const PipelineProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [pipelineResults, setPipelineResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const setApiKey = (provider: keyof ApiKeys, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }));
  };

  return (
    <PipelineContext.Provider
      value={{
        apiKeys,
        setApiKey,
        nodes,
        setNodes,
        edges,
        setEdges,
        pipelineResults,
        setPipelineResults,
        isExecuting,
        setIsExecuting,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error("usePipeline must be used within a PipelineProvider");
  }
  return context;
};
