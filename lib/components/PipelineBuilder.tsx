"use client";

import { validatePipeline } from "@/lib/pipelineUtils";
import { FileJson, FileText } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  Panel,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import FloatingControls from "./FloatingControls";
import DataSourceNode from "./nodes/DataSourceNode";
import OutputNode from "./nodes/OutputNode";
import RAGModelNode from "./nodes/RAGModelNode";
import NodeSelector from "./NodeSelector";
import { usePipeline } from "./PipelineContext";
import Sidebar from "./Sidebar";

// interface BaseNodeData {
//   label: string;
// }

// interface DataSourceNodeData extends BaseNodeData {
//   type: string;
//   inputText: string;
// }

// interface RAGModelNodeData extends BaseNodeData {
//   model: string;
//   modelName: string;
//   temperature: number;
//   systemPrompt: string;
// }

// interface OutputNodeData extends BaseNodeData {
//   format: string;
// }

// type NodeData = DataSourceNodeData | RAGModelNodeData | OutputNodeData;

// Define custom node types
const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
  ragModel: RAGModelNode,
  output: OutputNode,
};

// Initial nodes and edges for OpenAI pipeline
const initialNodes = [
  {
    id: "data-1",
    type: "dataSource",
    data: { label: "User Input", type: "api", inputText: "" },
    position: { x: 250, y: 100 },
  },
  {
    id: "rag-1",
    type: "ragModel",
    data: {
      label: "OpenAI Model",
      model: "openai",
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      systemPrompt: "You are a helpful assistant.",
    },
    position: { x: 250, y: 250 },
  },
  {
    id: "output-1",
    type: "output",
    data: { label: "Response Output", format: "text" },
    position: { x: 250, y: 400 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "data-1", target: "rag-1" },
  { id: "e2-3", source: "rag-1", target: "output-1" },
];

const PipelineBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes: contextNodes,
    setNodes: setContextNodes,
    edges: contextEdges,
    setEdges: setContextEdges,
    apiKeys,
    isExecuting,
    setIsExecuting,
    pipelineResults,
    setPipelineResults,
  } = usePipeline();

  // If there are nodes in context, use those, otherwise use initial nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(
    contextNodes.length > 0 ? contextNodes : initialNodes,
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    contextEdges.length > 0 ? contextEdges : initialEdges,
  );

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Update context when nodes or edges change
  useEffect(() => {
    setContextNodes(nodes);
    setContextEdges(edges);
  }, [nodes, edges, setContextNodes, setContextEdges]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle dragging a new node from the panel
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle dropping a new node onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Calculate node position with offset adjustment
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a new node based on the type - correct the typing
      const newNode: Node = {
        id: `${type}-${uuidv4()}`,
        type,
        position,
        data: {}, // Initialize with empty data that we'll populate below
      };

      switch (type) {
        case "dataSource":
          newNode.data = { label: "User Input", type: "api", inputText: "" };
          break;
        case "ragModel":
          newNode.data = {
            label: "OpenAI Model",
            model: "openai",
            modelName: "gpt-4o-mini",
            temperature: 0.7,
            systemPrompt: "You are a helpful assistant.",
          };
          break;
        case "output":
          newNode.data = { label: "Output", format: "text" };
          break;
        default:
          return;
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Clear node selection when clicking on the canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node deletion
  const onDeleteNode = useCallback(() => {
    if (selectedNode) {
      // Delete the node
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));

      // Delete connected edges
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
        ),
      );

      setSelectedNode(null);
      toast.success("Node deleted");
    }
  }, [selectedNode, setNodes, setEdges]);

  // Handle all nodes deletion
  const deleteAllNodes = useCallback(() => {
    if (nodes.length === 0) {
      toast.info("No nodes to delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete all nodes?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      toast.success("All nodes deleted");
    }
  }, [nodes.length, setNodes, setEdges]);

  // Handle keyboard events for deletion
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedNode
      ) {
        // Only delete if we have a selected node and we're not inside a text input
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT");

        if (!isInputActive) {
          onDeleteNode();
        }
      }
    },
    [selectedNode, onDeleteNode],
  );

  const handleValidate = () => {
    const result = validatePipeline(nodes, edges);

    if (!result.valid) {
      // Show validation errors as toast messages
      result.errors.forEach((error: string) => {
        toast.error(error);
      });

      result.warnings.forEach((warning: string) => {
        toast.warning(warning);
      });

      return result;
    } else {
      toast.success("Pipeline validation successful!");
      return result;
    }
  };

  // Execute the pipeline
  const executePipeline = async () => {
    // Validate the pipeline first
    const validationResult = handleValidate();
    if (!validationResult.valid) {
      return;
    }

    if (!apiKeys.openai) {
      toast.error("Please set your OpenAI API key first");
      return;
    }

    setIsExecuting(true);
    setPipelineResults(null);

    try {
      // Find the data source node(s)
      const dataSourceNodes = nodes.filter(
        (node) => node.type === "dataSource",
      );
      if (dataSourceNodes.length === 0) {
        throw new Error("No data source node found");
      }

      // Find the RAG model node(s)
      const ragModelNodes = nodes.filter((node) => node.type === "ragModel");
      if (ragModelNodes.length === 0) {
        throw new Error("No RAG model node found");
      }

      // Find the output node(s)
      const outputNodes = nodes.filter((node) => node.type === "output");
      if (outputNodes.length === 0) {
        throw new Error("No output node found");
      }

      // Get user input from the data source node
      const inputNode = dataSourceNodes[0];
      const inputText = inputNode.data.inputText || "";

      if (!inputText) {
        throw new Error("Please enter some input text in the data source node");
      }

      // Get the model configuration from the RAG model node
      const modelNode = ragModelNodes[0];
      const modelName = modelNode.data.modelName || "gpt-4o-mini";
      const temperature = parseFloat(modelNode.data.temperature) || 0.7;
      const systemPrompt =
        modelNode.data.systemPrompt || "You are a helpful assistant.";

      // Get the output format from the output node
      const outputNode = outputNodes[0];
      const outputFormat = outputNode.data.format || "text";

      // Create the messages for the API call
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: inputText },
      ];

      // Show processing toast
      const loadingToast = toast.loading("Processing your request...");

      // Make the API call
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: apiKeys.openai,
          model: modelName,
          messages,
          temperature,
          format: outputFormat,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to execute pipeline");
      }

      const result = await response.json();
      setPipelineResults(result);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Pipeline executed successfully");
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Pipeline execution failed";
      console.error("Pipeline execution error:", error);
      toast.error(errorMessage);
      setPipelineResults({ error: errorMessage });
    } finally {
      setIsExecuting(false);
    }
  };

  // Pre-render the result content to avoid conditional hook calls
  const renderResultContent = () => {
    if (!pipelineResults || pipelineResults.error) {
      return null;
    }

    // Find the output node to determine if this should be rendered as JSON
    const outputNodes = nodes.filter((node) => node.type === "output");
    const isJsonOutput =
      outputNodes.length > 0 && outputNodes[0].data.format === "json";

    let content = "";
    if (pipelineResults.choices && pipelineResults.choices[0]) {
      content = pipelineResults.choices[0].message.content;

      // If this is JSON output, try to pretty-print it
      if (isJsonOutput && content) {
        try {
          const jsonObj = JSON.parse(content);
          content = JSON.stringify(jsonObj, null, 2);
        } catch (e) {
          // If parsing fails, use the original content
          console.error("Failed to parse JSON:", e);
        }
      }
    }

    return (
      <div className="absolute bottom-4 right-4 z-40 w-96 max-h-[500px] bg-card p-4 rounded-md shadow-md border border-border overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold flex items-center">
            {isJsonOutput ? (
              <>
                <FileJson size={16} className="mr-1" />
                <span>JSON Result</span>
              </>
            ) : (
              <>
                <FileText size={16} className="mr-1" />
                <span>Text Result</span>
              </>
            )}
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setPipelineResults(null)}
          >
            &times;
          </button>
        </div>
        <div className="border border-border rounded-md p-3 bg-background">
          {content ? (
            <pre
              className={`text-sm ${
                isJsonOutput ? "font-mono bg-muted/20 p-2 rounded" : ""
              } whitespace-pre-wrap`}
            >
              {content}
            </pre>
          ) : (
            <div className="text-muted-foreground text-sm">
              No results available
            </div>
          )}
        </div>
      </div>
    );
  };

  const resultContent = renderResultContent();

  return (
    <div className="h-full w-full flex" onKeyDown={onKeyDown} tabIndex={0}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main workflow area */}
      <div className="flex-1 h-full relative">
        {/* Floating Controls */}
        <FloatingControls
          onValidate={handleValidate}
          onExecute={executePipeline}
          onDeleteAll={deleteAllNodes}
          onDeleteSelected={onDeleteNode}
          selectedNode={selectedNode}
          nodesCount={nodes.length}
        />

        {/* Show result content when available */}
        {resultContent}

        {/* ReactFlow canvas */}
        <div ref={reactFlowWrapper} className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            attributionPosition="bottom-right"
            nodesDraggable={!isExecuting}
            nodesConnectable={!isExecuting}
            elementsSelectable={!isExecuting}
            className="w-full h-full"
          >
            <Controls className="m-2" />
            <MiniMap className="m-2" />
            <Background gap={20} size={1.5} className="bg-background" />

            <Panel
              position="top-left"
              className="m-2 bg-card p-4 rounded-lg shadow-md border border-border"
            >
              <NodeSelector disabled={isExecuting} />
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default PipelineBuilder;
