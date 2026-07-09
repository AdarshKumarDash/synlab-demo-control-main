import { useEffect, useState } from "react";
import { fetchSensorData } from "@/lib/api";

/* ================= TYPES ================= */
export interface SensorData {
  temperature?: number;
  humidity?: number;
  gas?: number;
  soil?: number;
  water?: number;
  distance?: number;
  weight?: number;

  oscillations?: number;
  frequency?: number;
  period?: number;

  potValue?: number;
  potVoltage?: number;
  red?: number;
  green?: number;
  blue?: number;

  emergency: boolean;
}

/* ================= HOOK ================= */
export function useSensors() {
  const [data, setData] = useState<SensorData | null>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const result = await fetchSensorData();
        if (!mounted) return;

        setData({
          temperature: result.temperature ?? undefined,
          humidity: result.humidity ?? undefined,
          gas: result.gas ?? 0,
          soil: result.soil ?? 0,
          water: result.water ?? 0,
          distance: result.distance ?? -1,
          weight: result.weight ?? 0,

          oscillations: result.oscillations ?? 0,
          period: result.period ?? 0,
          frequency: result.frequency ?? 0,

          potValue: result.potValue ?? 0,
          potVoltage: result.potVoltage ?? 0,

          red: result.red ?? 0,
          green: result.green ?? 0,
          blue: result.blue ?? 0,

          emergency: result.emergency ?? false,
        });

        setOnline(true);
      } catch {
        if (!mounted) return;
        setOnline(false);
      }
    };

    poll(); // instant first fetch
    const interval = setInterval(poll, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, online };
}
