// components/ApiKeyConfig.tsx
"use client";

import { Check, Eye, EyeOff, Key, Save } from "lucide-react";
import { useState } from "react";
import { usePipeline } from "./PipelineContext";
const ApiKeyConfig = () => {
  const { apiKeys, setApiKey } = usePipeline();
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || "");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(!!apiKeys.openai);

  const handleSave = () => {
    setApiKey("openai", openaiKey);
    setIsSaved(true);

    // Auto-hide after saving
    setTimeout(() => {
      setShowKey(false);
    }, 1000);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Key size={16} className="text-primary" />
        <span>OpenAI API Key</span>
      </h3>

      <div className="space-y-2">
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={openaiKey}
            onChange={(e) => {
              setOpenaiKey(e.target.value);
              setIsSaved(false);
            }}
            placeholder="sk-..."
            className="w-full border border-input rounded-md p-2 pr-9 text-sm bg-background"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowKey(!showKey)}
            type="button"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <button
          className={`w-full px-3 py-2 text-sm rounded-md ${
            isSaved
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          } flex items-center justify-center gap-1`}
          onClick={handleSave}
        >
          {isSaved ? <Check size={14} /> : <Save size={14} />}
          {isSaved ? "Saved" : "Save API Key"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser only.
      </p>
    </div>
  );
};

export default ApiKeyConfig;
