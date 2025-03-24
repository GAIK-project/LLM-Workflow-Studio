// components/nodes/RAGModelNode.tsx
import { BrainCircuit, ChevronDown, ChevronUp } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const RAGModelNode = ({ data, isConnectable }: NodeProps) => {
  const [expanded, setExpanded] = useState(true);

  // Control local state from node data
  const [modelName, setModelName] = useState(data.modelName || "gpt-4o-mini");
  const [temperature, setTemperature] = useState(data.temperature || 0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    data.systemPrompt || "You are a helpful assistant.",
  );

  const openaiModels = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ];

  // Update node data when inputs change
  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newModel = e.target.value;
      setModelName(newModel);
      data.modelName = newModel;
    },
    [data],
  );

  const handleTemperatureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTemp = parseFloat(e.target.value);
      setTemperature(newTemp);
      data.temperature = newTemp;
    },
    [data],
  );

  const handleSystemPromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newPrompt = e.target.value;
      setSystemPrompt(newPrompt);
      data.systemPrompt = newPrompt;
    },
    [data],
  );

  return (
    <div className="bg-white border-2 border-green-500 rounded-md shadow-md w-64">
      <div
        className="bg-green-500 text-white p-2 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} />
          <span className="font-medium">{data.label}</span>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              OpenAI Model
            </label>
            <select
              className="w-full border rounded p-1 text-sm"
              value={modelName}
              onChange={handleModelChange}
            >
              {openaiModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Temperature
            </label>
            <input
              type="range"
              className="w-full"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={handleTemperatureChange}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 (Deterministic)</span>
              <span>{temperature}</span>
              <span>2 (Creative)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              System Prompt
            </label>
            <textarea
              className="w-full border rounded p-2 text-sm h-16"
              placeholder="Enter system prompt"
              value={systemPrompt}
              onChange={handleSystemPromptChange}
            />
          </div>
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="data-in"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="data-out"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default RAGModelNode;
