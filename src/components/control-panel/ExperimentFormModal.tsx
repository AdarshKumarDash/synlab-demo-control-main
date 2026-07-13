import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  X,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  FlaskConical,
} from "lucide-react";
import type { ExperimentConfig } from "@/pages/ControlPanel";

interface ExperimentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (config: ExperimentConfig) => void;
}

const ExperimentFormModal = ({
  open,
  onOpenChange,
  onStart,
}: ExperimentFormModalProps) => {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [duration, setDuration] = useState([15]);
  const [targetTemperature, setTargetTemperature] = useState([25]);
  const [waterSupply, setWaterSupply] = useState(false);
  const [enableAI, setEnableAI] = useState(false);

  const [researchQuestion, setResearchQuestion] = useState("");

  const [hypothesis, setHypothesis] = useState("");

  const [materials, setMaterials] = useState("");

  const [procedure, setProcedure] = useState("");

  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [safetyMonitoring, setSafetyMonitoring] = useState({
    gas: true,
    temperature: true,
    waterLevel: true,
  });

  const handleSubmit = () => {
    const config: ExperimentConfig = {
      name,
      objective,

      duration: duration[0],
      heaterTemperature: targetTemperature[0],

      waterSupply,
      safetyMonitoring,

      generateAIReport: enableAI,

      researchQuestion,
      hypothesis,
      materials,
      procedure,
      expectedOutcome,
    };
    onStart(config);
    // Reset form
    setName("");
    setObjective("");
    setDuration([15]);
    setTargetTemperature([25]);
    setWaterSupply(false);
    setEnableAI(false);

    setResearchQuestion("");

    setHypothesis("");

    setMaterials("");

    setProcedure("");

    setExpectedOutcome("");
    setSafetyMonitoring({ gas: true, temperature: true, waterLevel: true });
  };

  const isValid = name.trim() && objective.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-border/50 shadow-floating">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-display">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary-foreground" />
            </div>
            Perform Experiment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Experiment Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Experiment Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Water Conductivity Test"
              className="rounded-xl"
            />
          </div>

          {/* Experiment Objective */}
          <div className="space-y-2">
            <Label htmlFor="objective" className="text-sm font-medium">
              Experiment Objective
            </Label>
            <Input
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What do you want to discover?"
              className="rounded-xl"
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Duration (minutes)</Label>
              <span className="text-sm text-primary font-mono font-medium">
                {duration[0]} min
              </span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          {/* Induction Heater Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sensor-temperature" />
                Induction Heater Temperature
              </Label>
              <span className="text-sm text-sensor-temperature font-mono font-medium">
                {targetTemperature[0]}°C
              </span>
            </div>
            <Slider
              value={targetTemperature}
              onValueChange={setTargetTemperature}
              min={50}
              max={350}
              step={1}
              className="w-full"
            />
          </div>

          {/* Water Supply & Peltier Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sensor-water" />
                Water Supply
              </Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={waterSupply}
                  onCheckedChange={setWaterSupply}
                />
                <span className="text-sm text-muted-foreground">
                  {waterSupply ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Laboratory Assistant */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">🧠 AI Laboratory Assistant</h3>

                <p className="text-xs text-muted-foreground">
                  Generate automatic experiment analysis, conclusions and
                  recommendations.
                </p>
              </div>

              <Switch checked={enableAI} onCheckedChange={setEnableAI} />
            </div>
          </div>

          {enableAI && (
            <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
              <div>
                <Label>Research Question</Label>

                <Input
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  placeholder="What are you investigating?"
                />
              </div>

              <div>
                <Label>Hypothesis</Label>

                <Input
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="Expected scientific outcome"
                />
              </div>

              <div>
                <Label>Materials Used</Label>

                <Input
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Water, Beaker, Sensor..."
                />
              </div>

              <div>
                <Label>Procedure</Label>

                <Input
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="Steps followed"
                />
              </div>

              <div>
                <Label>Expected Outcome</Label>

                <Input
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  placeholder="Expected result"
                />
              </div>
            </div>
          )}

          {/* Safety Monitoring */}
          <div className="p-4 rounded-xl bg-accent-soft border border-accent/20 space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              🛡️ Safety Monitoring
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card">
                <Wind className="w-5 h-5 text-sensor-gas" />
                <span className="text-xs text-muted-foreground">Gas</span>
                <Switch
                  checked={safetyMonitoring.gas}
                  onCheckedChange={(v) =>
                    setSafetyMonitoring((s) => ({ ...s, gas: v }))
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card">
                <Thermometer className="w-5 h-5 text-sensor-temperature" />
                <span className="text-xs text-muted-foreground">Temp</span>
                <Switch
                  checked={safetyMonitoring.temperature}
                  onCheckedChange={(v) =>
                    setSafetyMonitoring((s) => ({ ...s, temperature: v }))
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card">
                <Waves className="w-5 h-5 text-sensor-water" />
                <span className="text-xs text-muted-foreground">Water</span>
                <Switch
                  checked={safetyMonitoring.waterLevel}
                  onCheckedChange={(v) =>
                    setSafetyMonitoring((s) => ({ ...s, waterLevel: v }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 control-btn-accent"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Experiment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperimentFormModal;
