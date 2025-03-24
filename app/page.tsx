import PipelineBuilder from "@/lib/components/PipelineBuilder";
import { PipelineProvider } from "@/lib/components/PipelineContext";

export default function Home() {
  return (
    <PipelineProvider>
      <main className="fullscreen-layout">
        <div className="flex h-full">
          {/* Main area with pipeline editor */}
          <div className="flex-1 h-full relative">
            <PipelineBuilder />
          </div>
        </div>
      </main>
    </PipelineProvider>
  );
}
