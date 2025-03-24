// components/NodeSelector.tsx
import { BrainCircuit, Database, MessageSquare } from "lucide-react";
import React from "react";

interface NodeSelectorProps {
  disabled?: boolean;
}

const NodeSelector = ({ disabled = false }: NodeSelectorProps) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    if (disabled) return;
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-4 w-60">
      <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
        <span>Pipeline Components</span>
        <span className="text-xs text-muted-foreground font-normal">
          Drag to canvas
        </span>
      </h3>

      <div className="space-y-2">
        <div
          className={`flex items-center gap-2 p-3 bg-primary/5 border border-border rounded-lg ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-move hover:bg-primary/10 hover:shadow-sm transition-all"
          }`}
          onDragStart={(event) => onDragStart(event, "dataSource")}
          draggable={!disabled}
        >
          <Database size={18} className="text-primary" />
          <span className="font-medium">Data Source</span>
        </div>

        <div
          className={`flex items-center gap-2 p-3 bg-primary/5 border border-border rounded-lg ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-move hover:bg-primary/10 hover:shadow-sm transition-all"
          }`}
          onDragStart={(event) => onDragStart(event, "ragModel")}
          draggable={!disabled}
        >
          <BrainCircuit size={18} className="text-primary" />
          <span className="font-medium">OpenAI Model</span>
        </div>

        <div
          className={`flex items-center gap-2 p-3 bg-primary/5 border border-border rounded-lg ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-move hover:bg-primary/10 hover:shadow-sm transition-all"
          }`}
          onDragStart={(event) => onDragStart(event, "output")}
          draggable={!disabled}
        >
          <MessageSquare size={18} className="text-primary" />
          <span className="font-medium">Output</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border mt-4">
        Click nodes to select them
        <br />
        Press Delete key to remove selected nodes
      </div>
    </div>
  );
};

export default NodeSelector;
