// components/nodes/OutputNode.tsx
import {
  ChevronDown,
  ChevronUp,
  FileJson,
  FileText,
  MessageSquare,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const OutputNode = ({ data, isConnectable }: NodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(data.format || "text");

  const formats = [
    {
      value: "text",
      label: "Text",
      icon: <FileText size={14} className="mr-1" />,
    },
    {
      value: "json",
      label: "JSON",
      icon: <FileJson size={14} className="mr-1" />,
    },
  ];

  // Update node data when format changes
  const handleFormatChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFormat = e.target.value;
      setSelectedFormat(newFormat);
      data.format = newFormat;
    },
    [data],
  );

  return (
    <div className="shadow-sm rounded-md min-w-[14rem] w-full overflow-hidden">
      <div
        className="bg-amber-500 text-white p-2 flex items-center justify-between cursor-pointer rounded-t-md"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span className="font-medium">{data.label}</span>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {expanded && (
        <div className="p-3 space-y-3 bg-card rounded-b-md">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Output Format
            </label>
            <select
              className="w-full p-2 text-sm bg-background border border-input rounded-md"
              value={selectedFormat}
              onChange={handleFormatChange}
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            {selectedFormat === "json" ? (
              <div className="flex items-center">
                <FileJson size={14} className="mr-1" />
                <span className="break-words">
                  Returns structured data using AI SDK
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <FileText size={14} className="mr-1" />
                <span className="break-words">
                  Returns plain text responses
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="data-in"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
    </div>
  );
};

export default OutputNode;
