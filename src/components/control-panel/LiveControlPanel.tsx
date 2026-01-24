import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { setPumpState, stopExperiment } from "@/lib/api";
import { useSensors } from "@/hooks/useSensors";


import {
  Square,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Scale,
  FlaskConical,
  Radar,
  Timer,
  AlertTriangle,
} from "lucide-react";
import type { ExperimentConfig } from "@/pages/ControlPanel";

interface LiveControlPanelProps {
  experiment: ExperimentConfig;
  onStop: () => void;
}

const LiveControlPanel = ({ experiment, onStop }: LiveControlPanelProps) => {
  const { data, online } = useSensors();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [waterFlow, setWaterFlow] = useState(experiment.waterSupply);
  const [temperatureSet, setTemperatureSet] = useState([
    experiment.targetTemperature,
  ]);
  const [peltierMode, setPeltierMode] = useState(experiment.peltierMode);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = Math.min(
    (elapsedTime / 60 / experiment.duration) * 100,
    100,
  );

  return (
    <div className="space-y-6">
      {/* Experiment Header */}
      <div className="bg-card rounded-2xl border border-primary/20 shadow-glow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              {experiment.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {experiment.objective}
            </p>
          </div>
          <Button
            onClick={async () => {
              await stopExperiment(); // ESP32
              onStop(); // UI
            }}
            variant="destructive"
            className="rounded-xl gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Experiment
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              Elapsed: {formatTime(elapsedTime)}
            </span>
            <span className="text-muted-foreground">
              Duration: {experiment.duration} min
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-1000 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Water Supply Control */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-water/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sensor-water" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Water Supply</h4>
              <p className="text-xs text-muted-foreground">Flow Control</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <span className="text-sm text-foreground">
              {waterFlow ? "Flowing" : "Stopped"}
            </span>
            <Switch
              checked={waterFlow}
              onCheckedChange={async (checked) => {
                setWaterFlow(checked);
                await setPumpState(checked ? "on" : "off");
              }}
            />
          </div>
          {waterFlow && (
            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-full bg-sensor-water animate-wave rounded-full" />
            </div>
          )}
        </div>

        {/* Temperature Control */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-temperature/10 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-sensor-temperature" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">
                Temperature Control
              </h4>
              <p className="text-xs text-muted-foreground">
                {peltierMode === "heating" ? "🔥 Heating" : "❄️ Cooling"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target</span>
              <span className="font-mono text-sensor-temperature">
                {temperatureSet[0]}°C
              </span>
            </div>
            <Slider
              value={temperatureSet}
              onValueChange={setTemperatureSet}
              min={2}
              max={50}
              step={1}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={peltierMode === "heating" ? "default" : "outline"}
                onClick={() => setPeltierMode("heating")}
                className="flex-1 rounded-lg text-xs"
              >
                🔥 Heat
              </Button>
              <Button
                size="sm"
                variant={peltierMode === "cooling" ? "default" : "outline"}
                onClick={() => setPeltierMode("cooling")}
                className="flex-1 rounded-lg text-xs"
              >
                ❄️ Cool
              </Button>
            </div>
          </div>
        </div>

        {/* DHT11 Gauges */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-humidity/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sensor-humidity" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">DHT11 Sensor</h4>
              <p className="text-xs text-muted-foreground">Temp & Humidity</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <span className="text-2xl font-mono text-foreground">
                {data?.temperature !== undefined ? data.temperature : "—"}
              </span>
              <p className="text-xs text-muted-foreground mt-1">°C</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <span className="text-2xl font-mono text-foreground">
                {data?.humidity !== undefined ? data.humidity : "—"}
              </span>

              <p className="text-xs text-muted-foreground mt-1">%RH</p>
            </div>
          </div>
        </div>

        {/* MQ135 Gas Sensor */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-gas/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-sensor-gas" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">MQ135 Gas</h4>
              <p className="text-xs text-muted-foreground">Air Quality Index</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AQI Level</span>
              <span className="font-mono text-muted-foreground">—</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-status-active via-status-idle to-status-error rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Good</span>
              <span>Moderate</span>
              <span>Poor</span>
            </div>
          </div>
        </div>

        {/* Load Cell */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-weight/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-sensor-weight" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Load Cell</h4>
              <p className="text-xs text-muted-foreground">
                Weight Measurement
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <span className="text-lg font-mono text-muted-foreground">—</span>
              <p className="text-xs text-muted-foreground mt-1">Cell 1 (g)</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <span className="text-lg font-mono text-muted-foreground">—</span>
              <p className="text-xs text-muted-foreground mt-1">Cell 2 (g)</p>
            </div>
          </div>
          <div className="mt-2 p-2 bg-primary/5 rounded-lg text-center">
            <span className="text-xs text-muted-foreground">Total: </span>
            <span className="font-mono text-foreground">—</span>
          </div>
        </div>

        {/* pH Sensor */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-ph/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-sensor-ph" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">pH Sensor</h4>
              <p className="text-xs text-muted-foreground">Acidity Level</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-center p-3 bg-muted/50 rounded-xl">
              <span className="text-3xl font-mono text-muted-foreground">
                —
              </span>
              <p className="text-xs text-muted-foreground mt-1">pH Value</p>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-status-error via-status-active to-primary" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 (Acid)</span>
              <span>7</span>
              <span>14 (Base)</span>
            </div>
          </div>
        </div>

        {/* Water Level Tank */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-water/10 flex items-center justify-center">
              <Waves className="w-5 h-5 text-sensor-water" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Water Level</h4>
              <p className="text-xs text-muted-foreground">Tank Monitor</p>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 h-24 bg-muted/50 rounded-xl relative overflow-hidden border-2 border-border">
              <div className="absolute bottom-0 left-0 right-0 h-0 bg-sensor-water/30 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-foreground">
                  {data?.gas !== undefined ? data.gas : "—"}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Full</div>
              <div className="h-12" />
              <div>Empty</div>
            </div>
          </div>
        </div>

        {/* Ultrasonic Radar */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sensor-distance/10 flex items-center justify-center">
              <Radar className="w-5 h-5 text-sensor-distance" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Ultrasonic</h4>
              <p className="text-xs text-muted-foreground">Distance Radar</p>
            </div>
          </div>
          <div className="relative aspect-square max-w-[120px] mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-sensor-distance/20" />
            <div className="absolute inset-3 rounded-full border border-sensor-distance/15" />
            <div className="absolute inset-6 rounded-full border border-sensor-distance/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-sensor-distance" />
            </div>
            <div className="absolute inset-0 origin-center animate-radar">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-sensor-distance to-transparent" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Distance:{" "}
            <span className="font-mono">
              {data?.distance !== undefined ? data.distance : "—"}
            </span>{" "}
            cm
          </p>
        </div>
      </div>

      {/* Safety Alert Section */}
      {(experiment.safetyMonitoring.gas ||
        experiment.safetyMonitoring.temperature ||
        experiment.safetyMonitoring.waterLevel) && (
        <div className="p-4 rounded-2xl bg-accent-soft border border-accent/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <div>
              <h4 className="font-medium text-foreground">
                Safety Monitoring Active
              </h4>
              <p className="text-sm text-muted-foreground">
                Monitoring:{" "}
                {[
                  experiment.safetyMonitoring.gas && "Gas",
                  experiment.safetyMonitoring.temperature && "Temperature",
                  experiment.safetyMonitoring.waterLevel && "Water Level",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveControlPanel;
