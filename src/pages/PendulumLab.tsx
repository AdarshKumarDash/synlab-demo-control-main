import { useSensors } from "@/hooks/useSensors";
import PendulumAnimation from "@/components/PendulumAnimation";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PENDULUM_LENGTH } from "@/config/pendulum";

export default function PendulumLab() {
  const { data } = useSensors();
  const navigate = useNavigate();

  const frequency = data?.frequency ?? 0;
  const period = data?.period ?? 0;
  const oscillations = data?.oscillations ?? 0;

  const length = PENDULUM_LENGTH;

  const wavelength = frequency > 0 ? 2 * Math.PI * length : 0;

  const speed = wavelength * frequency;

  return (
    <div className="min-h-screen p-8 space-y-8">
      <button
        onClick={() => navigate("/control-panel")}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
      <div className="bg-card border rounded-3xl p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Pendulum Analysis</h1>
          <div className="mt-4 flex gap-4 flex-wrap">
            <div className="px-4 py-2 rounded-xl bg-primary/10">
              Length: {PENDULUM_LENGTH} m
            </div>

            <div className="px-4 py-2 rounded-xl bg-primary/10">
              IR Sensor Active
            </div>

            <div className="px-4 py-2 rounded-xl bg-primary/10">
              Real-Time Monitoring
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-600">
            ● Live Experiment
          </div>
        </div>

        <p className="text-muted-foreground mt-2">
          Real-time oscillation analysis powered by SynLab
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PendulumAnimation frequency={frequency} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard title="Oscillations" value={oscillations} />

          <MetricCard title="Frequency" value={`${frequency.toFixed(2)} Hz`} />

          <MetricCard title="Time Period" value={`${period.toFixed(2)} s`} />

          <MetricCard title="Wave Speed" value={`${speed.toFixed(2)} m/s`} />

          <MetricCard title="Wavelength" value={`${wavelength.toFixed(2)} m`} />
        </div>
      </div>
      <div className="bg-card border rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-6">Physics Relationships</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Frequency</h3>

            <p className="text-lg">f = 1 / T</p>
          </div>

          <div className="border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Period</h3>

            <p className="text-lg">T = t / N</p>
          </div>

          <div className="border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Gravity</h3>

            <p className="text-lg">g = 9.81 m/s²</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="p-6 rounded-2xl border bg-card">
      <p className="text-muted-foreground">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
