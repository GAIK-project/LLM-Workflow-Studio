/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PipelineControls.tsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertCircle, Loader2, Play } from "lucide-react";
import { usePipeline } from "./PipelineContext";

interface PipelineControlsProps {
  onValidate: () => any;
  onExecute: () => Promise<void>;
  validationResult: any;
  isExecuting: boolean;
}

const PipelineControls = ({
  onValidate,
  onExecute,
  validationResult,
  isExecuting,
}: PipelineControlsProps) => {
  const { pipelineResults } = usePipeline();

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Pipeline Controls</h3>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1"
              onClick={onValidate}
              disabled={isExecuting}
            >
              <AlertCircle size={16} />
              <span>Validate</span>
            </button>

            <button
              className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                isExecuting
                  ? "bg-blue-200 text-blue-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={onExecute}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Execute Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {validationResult && (
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold mb-2">Validation Results</h3>

          {validationResult.errors.length > 0 && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.errors.map(
                    (error: string, index: number) => (
                      <li key={index}>{error}</li>
                    )
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationResult.warnings.length > 0 && (
            <Alert className="mb-2 bg-yellow-50 border-yellow-200 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.warnings.map(
                    (warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    )
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationResult.valid &&
            validationResult.errors.length === 0 &&
            validationResult.warnings.length === 0 && (
              <Alert className="mb-2 bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  Pipeline validation successful! Your pipeline is ready to run.
                </AlertDescription>
              </Alert>
            )}
        </div>
      )}

      {pipelineResults && (
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold mb-2">Pipeline Results</h3>

          {pipelineResults.error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{pipelineResults.error}</AlertDescription>
            </Alert>
          ) : (
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              {pipelineResults.choices && pipelineResults.choices[0] ? (
                <div className="text-sm whitespace-pre-wrap">
                  {pipelineResults.choices[0].message.content}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No results available
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PipelineControls;
