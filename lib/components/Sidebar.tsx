// components/Sidebar.tsx
"use client";

import { ChevronLeft, ChevronRight, Key } from "lucide-react";
import React, { useState } from "react";
import ApiKeyConfig from "./ApiKeyConfig";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`sidebar-container ${
        isCollapsed ? "w-12" : "w-72"
      } transition-all duration-300 ease-in-out border-r border-border bg-card h-full flex flex-col ${className}`}
    >
      <div className="flex justify-between items-center p-3 border-b border-border">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold">Configuration</h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1 hover:bg-secondary text-muted-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="mb-4">
            <ApiKeyConfig />
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="flex flex-col items-center p-2">
          <button
            className="p-2 rounded-md hover:bg-secondary text-primary mb-2"
            onClick={() => setIsCollapsed(false)}
            title="API Configuration"
          >
            <Key size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
