import { Activity } from "lucide-react";
import { useSensors } from "@/hooks/useSensors";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PENDULUM_LENGTH } from "@/config/pendulum";

const PendulumPanel = () => {
  const { data } = useSensors();
  const navigate = useNavigate();

  const frequency = data?.frequency ?? 0;
  const period = data?.period ?? 0;
  const oscillations = data?.oscillations ?? 0;

  const length = PENDULUM_LENGTH;

  const wavelength = frequency > 0 ? 2 * Math.PI * length : 0;

  const speed = wavelength * frequency;

  return (
    <div
      onClick={() => navigate("/pendulum")}
      className="
    bg-card rounded-2xl border border-border/50 p-6 h-full
    cursor-pointer
    hover:shadow-xl
    hover:scale-[1.02]
    transition-all duration-300
  "
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Pendulum Experiment</h3>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border">
          <p>Oscillations</p>
          <h2>{oscillations}</h2>
        </div>

        <div className="p-4 rounded-xl border">
          <p>Frequency</p>
          <h2>{frequency.toFixed(2)} Hz</h2>
        </div>

        <div className="p-4 rounded-xl border">
          <p>Time Period</p>
          <h2>{period.toFixed(2)} s</h2>
        </div>

        <div className="p-4 rounded-xl border">
          <p>Wave Speed</p>
          <h2>{speed.toFixed(2)} m/s</h2>
        </div>

        <div className="p-4 rounded-xl border">
          <p>Wavelength</p>
          <h2>{wavelength.toFixed(2)} m</h2>
        </div>
      </div>
    </div>
  );
};

export default PendulumPanel;
