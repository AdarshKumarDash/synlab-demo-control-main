import { useEffect, useState } from "react";
import { useSensors } from "@/hooks/useSensors";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RGBPoint {
  time: string;
  voltage: number;
  red: number;
  green: number;
  blue: number;
}

const RGBVisualizer = () => {
  const { data } = useSensors();

  const [history, setHistory] = useState<RGBPoint[]>([]);

  useEffect(() => {
    if (!data) return;

    const point: RGBPoint = {
      time: new Date().toLocaleTimeString(),

      voltage: data.potVoltage ?? 0,
      red: data.red ?? 0,
      green: data.green ?? 0,
      blue: data.blue ?? 0,
    };

    setHistory((prev) => [...prev.slice(-19), point]);
  }, [data]);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <h3 className="text-xl font-semibold mb-6">
        RGB Spectrum Visualization
      </h3>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="red"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="green"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="blue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RGBVisualizer;