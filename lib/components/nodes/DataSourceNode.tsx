// components/nodes/DataSourceNode.tsx
import { ChevronDown, ChevronUp, Database, MessageSquare } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const DataSourceNode = ({ data, isConnectable }: NodeProps) => {
  const [expanded, setExpanded] = useState(true);
  const [inputText, setInputText] = useState(data.inputText || "");

  const dataSourceTypes = [
    { value: "api", label: "User Input" },
    { value: "csv", label: "CSV File" },
    { value: "pdf", label: "PDF Document" },
    { value: "database", label: "Database" },
    { value: "web", label: "Web Scraping" },
  ];

  // Update node data when input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setInputText(newText);

      // This assumes there's a way to update the node data from outside
      // For now, we're just updating the local state
      data.inputText = newText;
    },
    [data]
  );

  // Prevent event propagation for keyboard events in the textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Stop propagation for all keyboard events in the textarea
      e.stopPropagation();
    },
    []
  );

  return (
    <div className="bg-card border border-border rounded-md shadow-sm w-64 overflow-hidden">
      <div
        className="bg-blue-500 text-white p-2 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Database size={16} />
          <span className="font-medium">{data.label}</span>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Data Source Type
            </label>
            <select
              className="w-full border border-input rounded-md p-1 text-sm bg-background"
              value={data.type || "api"}
              disabled
            >
              {dataSourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <MessageSquare size={12} />
              <span>User Input</span>
            </label>
            <textarea
              className="w-full border border-input rounded-md p-2 text-sm h-24 bg-background"
              placeholder="Enter your message or query here..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="data-out"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default DataSourceNode;
