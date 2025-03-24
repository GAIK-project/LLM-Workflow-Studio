"use client";

import { Check, Play, Trash2, X } from "lucide-react";
import React from "react";
import { Node } from "reactflow";
import { usePipeline } from "./PipelineContext";

interface FloatingControlsProps {
  onValidate: () => void;
  onExecute: () => void;
  onDeleteAll: () => void;
  onDeleteSelected: () => void;
  selectedNode: Node | null;
  nodesCount: number;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  onValidate,
  onExecute,
  onDeleteAll,
  onDeleteSelected,
  selectedNode,
  nodesCount,
}) => {
  const { isExecuting } = usePipeline();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {selectedNode && (
        <button
          className="px-3 py-2 text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md flex items-center gap-1 shadow-md"
          onClick={onDeleteSelected}
          disabled={isExecuting}
          title="Delete selected node"
        >
          <X size={16} />
          <span>Delete Selected</span>
        </button>
      )}

      <button
        className="px-3 py-2 text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md flex items-center gap-1 shadow-md"
        onClick={onDeleteAll}
        disabled={isExecuting || nodesCount === 0}
        title="Delete all nodes"
      >
        <Trash2 size={16} />
        <span>Delete All</span>
      </button>

      <button
        className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center gap-1 shadow-md"
        onClick={onValidate}
        disabled={isExecuting}
        title="Validate pipeline"
      >
        <Check size={16} />
        <span>Validate</span>
      </button>

      <button
        className={`px-3 py-2 text-sm rounded-md flex items-center gap-1 shadow-md ${
          isExecuting
            ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
        onClick={onExecute}
        disabled={isExecuting}
        title="Execute pipeline"
      >
        <Play size={16} />
        <span>{isExecuting ? "Executing..." : "Execute"}</span>
      </button>
    </div>
  );
};

export default FloatingControls;
