import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startExperiment } from "@/lib/api";
// Add this after your useState declarations
import { useEffect } from "react";

import { askGemini } from "@/ai/gemini";
import { Globe } from "lucide-react";
import RGBVisualizer from "@/components/control-panel/RGBVisualizer";
import { useSensors } from "@/hooks/useSensors";

const test = async () => {
  const res = await askGemini("Say hello from Cognix.");

  console.log(res);
};

test();

import {
  ArrowLeft,
  User,
  ChevronDown,
  Play,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SensorGrid from "@/components/control-panel/SensorGrid";
import LiveControlPanel from "@/components/control-panel/LiveControlPanel";
import ExperimentFormModal from "@/components/control-panel/ExperimentFormModal";
import ExperimentHistoryModal from "@/components/control-panel/ExperimentHistoryModal";
import USBMicroscopePanel from "@/components/control-panel/USBMicroscopePanel";
import PendulumPanel from "@/components/PendulumPanel";
import SynBotAssistant from "@/components/SynBotAssistant";
import Footer from "@/components/Footer";

export interface ExperimentConfig {
  name: string;
  objective: string;

  duration: number;
  targetTemperature: number;

  waterSupply: boolean;

  peltierMode: "heating" | "cooling";

  safetyMonitoring: {
    gas: boolean;
    temperature: boolean;
    waterLevel: boolean;
  };

  generateAIReport: boolean;

  researchQuestion: string;

  hypothesis: string;

  materials: string;

  procedure: string;

  expectedOutcome: string;
}

const ControlPanel = () => {
  const navigate = useNavigate();
  const { data } = useSensors();

  const [graphData, setGraphData] = useState<
    {
      time: string;
      voltage: number;
    }[]
  >([]);
  const [experimentStatus, setExperimentStatus] = useState<"idle" | "running">(
    "idle",
  );

  const [showExperimentForm, setShowExperimentForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSynBot, setShowSynBot] = useState(false);
  const [currentExperiment, setCurrentExperiment] =
    useState<ExperimentConfig | null>(null);

  useEffect(() => {
    if (!currentExperiment || experimentStatus === "idle") return;

    const durationSeconds = currentExperiment.duration * 60; // total duration in seconds
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += 1;

      if (elapsed >= durationSeconds) {
        // Auto-stop experiment in UI
        setExperimentStatus("idle");
        setCurrentExperiment(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExperiment, experimentStatus]);

  useEffect(() => {
    if (data?.potVoltage === undefined) return;

    setGraphData((prev) => [
      ...prev.slice(-29),
      {
        time: new Date().toLocaleTimeString(),
        voltage: data.potVoltage,
      },
    ]);
  }, [data?.potVoltage]);

  const handleStartExperiment = async (config: ExperimentConfig) => {
    await startExperiment({
      name: config.name,
      temp: config.targetTemperature,
      duration: config.duration,
    });

    setCurrentExperiment(config);
    setExperimentStatus("running");
    setShowExperimentForm(false);
  };

  const handleStopExperiment = () => {
    setExperimentStatus("idle");
    setCurrentExperiment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 lg:px-8 py-3">
          {/* Left: Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-primary-soft rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          {/* Center: Experiment Status */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <span
              className={`status-dot ${
                experimentStatus === "running"
                  ? "status-running"
                  : "status-idle"
              }`}
            />
            <span className="text-sm font-medium text-foreground">
              Experiment Status:{" "}
              <span
                className={
                  experimentStatus === "running"
                    ? "text-primary"
                    : "text-status-idle"
                }
              >
                {experimentStatus === "running" ? "Running" : "Idle"}
              </span>
            </span>
          </div>

          {/* Right: Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-primary-soft rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground hidden sm:block">
                  Adarsh
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="cursor-pointer rounded-lg"
              >
                Back to Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-8 py-6">
        {/* Primary Actions */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            onClick={() => setShowExperimentForm(true)}
            disabled={experimentStatus === "running"}
            className="control-btn-primary gap-3 text-base"
          >
            <Play className="w-5 h-5" />
            Perform Experiment
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="control-btn border-2 border-border hover:border-primary/30 hover:bg-primary-soft gap-3 text-base"
          >
            <FolderOpen className="w-5 h-5" />
            Experiment History
          </Button>
          <Button
            onClick={() => navigate("/environment")}
            variant="outline"
            className="control-btn border-2 border-border gap-3"
          >
            <Globe className="w-5 h-5" />
            Environmental Station
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Sensor Grid or Live Controls */}
          <div className="xl:col-span-2 space-y-6">
            <SensorGrid />

            {experimentStatus === "running" && currentExperiment && (
              <LiveControlPanel
                experiment={currentExperiment}
                onStop={handleStopExperiment}
              />
            )}

            <RGBVisualizer />
          </div>

          {/* Right: USB Microscope */}
          <div className="xl:col-span-1">
            <PendulumPanel />
          </div>
        </div>
      </main>

      {/* SynBot AI Assistant - Bottom Right */}
      <button
        onClick={() => setShowSynBot(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-synbot shadow-glow animate-glow-pulse flex items-center justify-center group hover:scale-110 transition-transform duration-300"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <span className="text-[10px] text-accent-foreground font-bold">
            AI
          </span>
        </span>
      </button>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ExperimentFormModal
        open={showExperimentForm}
        onOpenChange={setShowExperimentForm}
        onStart={handleStartExperiment}
      />
      <ExperimentHistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
      />
      <SynBotAssistant open={showSynBot} onOpenChange={setShowSynBot} />
    </div>
  );
};

export default ControlPanel;
